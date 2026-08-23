export interface Variable {
  name: string;
  type: string;        // full type string e.g. "vector<int>"
  baseType: string;    // base type key e.g. "vector"
  line: number;        // 1-indexed line where variable is declared
  scopeLevel: number;  // scope depth when declared
}

export class CppParser {
  /**
   * Parse C++ code and return all variable declarations with line numbers and scope levels.
   */
  static parse(code: string): { variables: Variable[]; lineScopeLevels: number[] } {
    const lines = code.split('\n');
    const variables: Variable[] = [];
    const lineScopeLevels: number[] = new Array(lines.length + 1).fill(0);

    let currentScope = 0;
    const seenNames = new Set<string>();

    for (let l = 0; l < lines.length; l++) {
      const lineNum = l + 1;
      const line = lines[l];

      // Calculate brace depth for this line
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;

      // Scope level before closing braces on this line
      lineScopeLevels[lineNum] = currentScope;

      currentScope += openBraces - closeBraces;
      if (currentScope < 0) currentScope = 0;

      // Clean line for parsing (strip comments and string literals)
      const cleanLine = line
        .replace(/\/\/.*/, '')
        .replace(/"([^"\\]|\\.)*"/g, '""')
        .replace(/'([^'\\]|\\.)*'/g, "''");

      // 1. Check for function parameter lists, e.g. (int target, vector<int>& nums)
      const paramMatches = cleanLine.matchAll(/(?:const\s+)?([a-zA-Z_][a-zA-Z0-9_<>:,\s\*&]+)\s+([a-zA-Z_][a-zA-Z0-9_]*)(?=[,\)])/g);
      for (const match of paramMatches) {
        const fullType = match[1].trim();
        const varName = match[2].trim();
        if (this.isValidIdentifier(varName) && !this.isKeyword(varName) && !seenNames.has(`${varName}_${lineScopeLevels[lineNum]}`)) {
          const baseType = this.extractBaseType(fullType);
          variables.push({
            name: varName,
            type: fullType,
            baseType: baseType,
            line: lineNum,
            scopeLevel: lineScopeLevels[lineNum],
          });
          seenNames.add(`${varName}_${lineScopeLevels[lineNum]}`);
        }
      }

      // 2. Check for for-loop variables: for (int i = 0; ...) or for (auto& x : nums)
      const forLoopMatch = cleanLine.match(/for\s*\(\s*(?:const\s+)?([a-zA-Z_][a-zA-Z0-9_<>:,\s\*&]+)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:=|\:)/);
      if (forLoopMatch) {
        const fullType = forLoopMatch[1].trim();
        const varName = forLoopMatch[2].trim();
        if (this.isValidIdentifier(varName) && !this.isKeyword(varName) && !seenNames.has(`${varName}_${lineScopeLevels[lineNum] + 1}`)) {
          variables.push({
            name: varName,
            type: fullType,
            baseType: this.extractBaseType(fullType),
            line: lineNum,
            scopeLevel: lineScopeLevels[lineNum] + 1, // Available inside loop body
          });
          seenNames.add(`${varName}_${lineScopeLevels[lineNum] + 1}`);
        }
      }

      // 3. Standard variable declarations: vector<int> nums; int n = 0; string s("hello");
      // Pattern: Type varName [= ...]; or Type varName;
      const declMatches = cleanLine.matchAll(/(?:^|[{};,])\s*(?:const\s+)?([a-zA-Z_][a-zA-Z0-9_<>:,\s\*&]+)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:=\s*[^;,]+|\([^)]*\))?\s*(?=[;,]|$)/g);
      for (const match of declMatches) {
        const fullType = match[1].trim();
        const varName = match[2].trim();

        // Skip keywords or control statements (e.g. return, if, else, throw)
        if (this.isValidIdentifier(varName) && !this.isKeyword(varName) && !this.isKeyword(fullType)) {
          const baseType = this.extractBaseType(fullType);
          if (baseType && !seenNames.has(`${varName}_${lineScopeLevels[lineNum]}`)) {
            variables.push({
              name: varName,
              type: fullType,
              baseType: baseType,
              line: lineNum,
              scopeLevel: lineScopeLevels[lineNum],
            });
            seenNames.add(`${varName}_${lineScopeLevels[lineNum]}`);
          }
        }
      }
    }

    return { variables, lineScopeLevels };
  }

  /**
   * Get variables that are validly in scope at cursor position (currentLine).
   */
  static getVariablesInScope(code: string, currentLine: number): Variable[] {
    const { variables, lineScopeLevels } = this.parse(code);
    const currentScope = lineScopeLevels[Math.min(currentLine, lineScopeLevels.length - 1)] ?? 0;

    const activeVariables: Variable[] = [];
    const seenNames = new Set<string>();

    // Process variables in reverse line order (closest declaration wins)
    for (let i = variables.length - 1; i >= 0; i--) {
      const v = variables[i];
      if (v.line <= currentLine && v.scopeLevel <= currentScope) {
        if (!seenNames.has(v.name)) {
          seenNames.add(v.name);
          activeVariables.push(v);
        }
      }
    }

    return activeVariables.reverse();
  }

  /**
   * Infer the base type of an expression (e.g., "nums", "root->left", "mp[key]").
   */
  static inferType(expression: string, inScopeVars: Variable[]): string | null {
    let expr = expression.trim();

    // Strip trailing dot or arrow if present
    expr = expr.replace(/(\.|\->)$/, '').trim();

    // Handle index expressions: e.g. nums[i] -> infer element type of vector
    if (expr.endsWith(']')) {
      const baseVar = expr.substring(0, expr.indexOf('[')).trim();
      const parentVar = inScopeVars.find(v => v.name === baseVar);
      if (parentVar) {
        return this.getElementType(parentVar.type);
      }
    }

    // Handle pointer access: e.g. root->left or root->right
    if (expr.includes('->')) {
      const parts = expr.split('->').map(p => p.trim());
      const rootVar = inScopeVars.find(v => v.name === parts[0]);
      if (rootVar && (rootVar.baseType === 'TreeNode' || rootVar.baseType === 'ListNode')) {
        const lastPart = parts[parts.length - 1];
        if (lastPart === 'left' || lastPart === 'right') return 'TreeNode';
        if (lastPart === 'next') return 'ListNode';
        return rootVar.baseType;
      }
    }

    // Direct variable lookup
    const directVar = inScopeVars.find(v => v.name === expr);
    if (directVar) {
      return directVar.baseType;
    }

    return null;
  }

  /**
   * Extract base type identifier from a complex C++ type string.
   * e.g. "std::vector<int>&" -> "vector"
   * "const string" -> "string"
   * "TreeNode*" -> "TreeNode"
   */
  public static extractBaseType(typeStr: string): string {
    let clean = typeStr
      .replace(/\bconst\b/g, '')
      .replace(/[&*]/g, '')
      .replace(/\bstd::/g, '')
      .trim();

    // If template, extract container name before '<'
    const angleIndex = clean.indexOf('<');
    if (angleIndex !== -1) {
      clean = clean.substring(0, angleIndex).trim();
    }

    return clean;
  }

  /**
   * Infer container element type.
   * e.g. "vector<string>" -> "string", "vector<int>" -> "int"
   */
  private static getElementType(typeStr: string): string {
    const match = typeStr.match(/<([^>]+)>/);
    if (match) {
      const inner = match[1].trim();
      return this.extractBaseType(inner);
    }
    return 'unknown';
  }

  private static isValidIdentifier(str: string): boolean {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(str);
  }

  private static isKeyword(str: string): boolean {
    const keywords = new Set([
      'int', 'long', 'double', 'float', 'char', 'bool', 'void', 'auto',
      'const', 'static', 'unsigned', 'signed', 'struct', 'class', 'enum',
      'if', 'else', 'for', 'while', 'do', 'return', 'break', 'continue',
      'switch', 'case', 'default', 'public', 'private', 'protected',
      'try', 'catch', 'throw', 'new', 'delete', 'true', 'false', 'nullptr',
      'sizeof', 'typedef', 'using', 'namespace', 'template', 'typename'
    ]);
    return keywords.has(str);
  }
}
