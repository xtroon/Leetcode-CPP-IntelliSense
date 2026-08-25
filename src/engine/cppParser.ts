export interface VariableSymbol {
  name: string;
  type: string;       // raw type e.g. "vector<int>", "string", "unordered_map<int, string>"
  baseType: string;   // normalized STL base e.g. "vector", "string", "unordered_map", "pair", "stack"
  scopeDepth: number; // brace depth level where declared
  offset: number;     // character index in source code where declared
}

export interface TriggerContext {
  isMemberAccess: boolean;  // true if trigger is . or ->
  targetExpr: string;       // e.g. "nums", "s", "st"
  memberPrefix?: string;    // e.g. "p" if typed "nums.p"
  baseType?: string;        // mapped STL type if known
  matchedVariable?: string; // name of declared variable if fuzzy matched
}

// STL Base Normalizer
export function extractBaseType(rawType: string): string {
  const clean = rawType.trim()
    .replace(/^const\s+/, '')
    .replace(/[*&]/g, '')
    .replace(/^std::/, '')
    .trim();
  const match = clean.match(/^([a-zA-Z0-9_]+)/);
  if (!match) return clean;
  return match[1];
}

// Levenshtein Distance for typo tolerance
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// Fuzzy Subsequence Matching
export function isFuzzyMatch(pattern: string, target: string): boolean {
  pattern = pattern.toLowerCase();
  target = target.toLowerCase();
  if (target.includes(pattern)) return true;

  let pIdx = 0;
  for (let tIdx = 0; tIdx < target.length && pIdx < pattern.length; tIdx++) {
    if (target[tIdx] === pattern[pIdx]) {
      pIdx++;
    }
  }
  return pIdx === pattern.length;
}

/**
 * Parses C++ source code up to the given cursor offset to extract in-scope variables.
 */
export function parseVariables(code: string, cursorOffset: number): VariableSymbol[] {
  const codeBeforeCursor = code.substring(0, cursorOffset);
  const symbols: VariableSymbol[] = [];
  const seenNames = new Set<string>();

  // Primitive / Standard C++ keywords to filter out of variable names
  const reserved = new Set([
    'if', 'else', 'for', 'while', 'do', 'return', 'switch', 'case', 'break', 'continue',
    'class', 'struct', 'public', 'private', 'protected', 'virtual', 'override',
    'void', 'int', 'double', 'float', 'bool', 'char', 'long', 'short', 'unsigned', 'signed', 'auto',
    'const', 'static', 'constexpr', 'nullptr', 'true', 'false', 'using', 'namespace', 'template', 'typename',
    'Solution'
  ]);

  // Helper to add symbol
  const addSymbol = (varName: string, rawType: string, scopeDepth: number, offset: number) => {
    varName = varName.trim();
    rawType = rawType.trim();
    if (!varName || !rawType || reserved.has(varName) || seenNames.has(varName)) {
      return;
    }
    // Filter out invalid identifier names
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
      return;
    }
    seenNames.add(varName);
    symbols.push({
      name: varName,
      type: rawType,
      baseType: extractBaseType(rawType),
      scopeDepth,
      offset
    });
  };

  // 1. Extract function parameters
  const funcHeaderRegex = /\(([\s\S]*?)\)\s*(?:const)?\s*\{/g;
  let funcMatch: RegExpExecArray | null;
  while ((funcMatch = funcHeaderRegex.exec(codeBeforeCursor)) !== null) {
    const paramList = funcMatch[1];
    const params = splitParameters(paramList);
    params.forEach(param => {
      const trimmed = param.trim();
      if (!trimmed) return;
      const lastSpace = trimmed.lastIndexOf(' ');
      const lastPtr = Math.max(trimmed.lastIndexOf('*'), trimmed.lastIndexOf('&'));
      const splitIdx = Math.max(lastSpace, lastPtr);
      if (splitIdx !== -1) {
        const typeStr = trimmed.substring(0, splitIdx + 1).trim();
        const nameStr = trimmed.substring(splitIdx + 1).trim();
        addSymbol(nameStr, typeStr, 0, funcMatch!.index);
      }
    });
  }

  // 2. Extract local variables
  const lines = codeBeforeCursor.split('\n');
  let runningOffset = 0;
  let currentDepth = 0;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const trimmed = line.trim();

    // Track braces
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      if (line[charIdx] === '{') currentDepth++;
      else if (line[charIdx] === '}') {
        if (currentDepth > 0) currentDepth--;
      }
    }

    // Skip comment lines & preprocessor directives
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*')) {
      runningOffset += line.length + 1;
      continue;
    }

    // Declaration regex matching
    const declRegex = /(?:(?:const\s+)?(?:std::)?((?:vector|unordered_map|map|unordered_set|set|stack|queue|priority_queue|deque|pair|string|int|long\s+long|double|float|bool|char|auto|[A-Z][a-zA-Z0-9_]*\*?)(?:<[^;{}]*?>)?))\s+([a-zA-Z_][a-zA-Z0-9_]*)[^;,]*(?:\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)[^;,]*)*\s*;/g;

    let match: RegExpExecArray | null;
    while ((match = declRegex.exec(line)) !== null) {
      const rawType = match[1];
      const firstVar = match[2];
      addSymbol(firstVar, rawType, currentDepth, runningOffset + match.index);

      if (match[3]) {
        addSymbol(match[3], rawType, currentDepth, runningOffset + match.index);
      }
    }

    // Range-for loop variables
    const rangeForRegex = /for\s*\(\s*(?:const\s+)?([a-zA-Z0-9_:<>&*]+)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g;
    let forMatch: RegExpExecArray | null;
    while ((forMatch = rangeForRegex.exec(line)) !== null) {
      addSymbol(forMatch[2], forMatch[1], currentDepth, runningOffset + forMatch.index);
    }

    // Traditional for loop variables
    const tradForRegex = /for\s*\(\s*([a-zA-Z0-9_]+)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
    let tradMatch: RegExpExecArray | null;
    while ((tradMatch = tradForRegex.exec(line)) !== null) {
      addSymbol(tradMatch[2], tradMatch[1], currentDepth, runningOffset + tradMatch.index);
    }

    runningOffset += line.length + 1;
  }

  return symbols;
}

// Splits parameter list considering nested <> brackets
function splitParameters(paramStr: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = '';

  for (let i = 0; i < paramStr.length; i++) {
    const c = paramStr[i];
    if (c === '<' || c === '(') depth++;
    else if (c === '>' || c === ')') depth--;
    else if (c === ',' && depth === 0) {
      result.push(current);
      current = '';
      continue;
    }
    current += c;
  }
  if (current.trim()) {
    result.push(current);
  }
  return result;
}

/**
 * Finds the best matching declared variable (exact or typo/spelling match).
 */
function findMatchingVariable(expr: string, variables: VariableSymbol[]): VariableSymbol | undefined {
  if (variables.length === 0) return undefined;

  // 1. Exact match
  const exact = variables.find(v => v.name === expr);
  if (exact) return exact;

  // 2. Case-insensitive match
  const caseInsensitive = variables.find(v => v.name.toLowerCase() === expr.toLowerCase());
  if (caseInsensitive) return caseInsensitive;

  // 3. Typo / Spelling distance match (Levenshtein distance <= 2)
  let bestMatch: VariableSymbol | undefined = undefined;
  let minDistance = 3;

  for (const v of variables) {
    const dist = levenshteinDistance(expr, v.name);
    if (dist <= 2 && dist < minDistance) {
      minDistance = dist;
      bestMatch = v;
    }
  }

  // 4. Subsequence match (e.g. vnums -> nums or vec -> vector)
  if (!bestMatch) {
    bestMatch = variables.find(v => isFuzzyMatch(v.name, expr) || isFuzzyMatch(expr, v.name));
  }

  return bestMatch;
}

/**
 * Checks line prefix up to cursor to see if user typed `.` or `->` after an expression.
 */
export function getTriggerContext(lineUntilCursor: string, variables: VariableSymbol[]): TriggerContext {
  const dotMatch = lineUntilCursor.match(/([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)?$/);
  if (dotMatch) {
    const expr = dotMatch[1];
    const memberPrefix = dotMatch[2] || '';
    const matchedVar = findMatchingVariable(expr, variables);

    let baseType = matchedVar ? matchedVar.baseType : undefined;
    if (!baseType) {
      const lowerExpr = expr.toLowerCase();
      if (lowerExpr.includes('hash') || lowerExpr.includes('set') || lowerExpr === 'st' || lowerExpr === 'seen' || lowerExpr === 'visited') {
        baseType = 'unordered_set';
      } else if (lowerExpr.includes('map') || lowerExpr === 'mp' || lowerExpr === 'dict') {
        baseType = 'unordered_map';
      } else if (lowerExpr === 'v' || lowerExpr === 'vec' || lowerExpr.includes('vector') || lowerExpr === 'nums' || lowerExpr === 'arr') {
        baseType = 'vector';
      } else if (lowerExpr === 's' || lowerExpr === 'str' || lowerExpr.includes('string')) {
        baseType = 'string';
      }
    }

    return {
      isMemberAccess: true,
      targetExpr: expr,
      memberPrefix,
      baseType,
      matchedVariable: matchedVar ? matchedVar.name : undefined
    };
  }

  const arrowMatch = lineUntilCursor.match(/([a-zA-Z_][a-zA-Z0-9_]*)->([a-zA-Z_][a-zA-Z0-9_]*)?$/);
  if (arrowMatch) {
    const expr = arrowMatch[1];
    const memberPrefix = arrowMatch[2] || '';
    const matchedVar = findMatchingVariable(expr, variables);

    let baseType = matchedVar ? matchedVar.baseType : undefined;
    if (!baseType) {
      const lowerExpr = expr.toLowerCase();
      if (lowerExpr === 'head' || lowerExpr === 'curr' || lowerExpr === 'tail' || lowerExpr === 'dummy' || lowerExpr === 'prev' || lowerExpr === 'next' || lowerExpr.includes('node')) {
        baseType = 'ListNode';
      }
    }

    return {
      isMemberAccess: true,
      targetExpr: expr,
      memberPrefix,
      baseType,
      matchedVariable: matchedVar ? matchedVar.name : undefined
    };
  }

  return { isMemberAccess: false, targetExpr: '' };
}
