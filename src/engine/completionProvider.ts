import { MonacoCompletionItem, MonacoModel, MonacoPosition, MonacoCompletionContext } from '../types/monaco';
import { CppParser, Variable } from './cppParser';
import { STL_DEFINITIONS } from './stlDefinitions';
import { CP_SNIPPETS } from './snippets';

export interface CompletionConfig {
  autocompleteEnabled: boolean;
  snippetsEnabled: boolean;
}

export class LeetSenseProvider {
  private config: CompletionConfig = {
    autocompleteEnabled: true,
    snippetsEnabled: true,
  };

  public updateConfig(newConfig: Partial<CompletionConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public triggerCharacters = ['.', '>', '<'];

  public provideCompletionItems(
    model: MonacoModel,
    position: MonacoPosition,
    context: MonacoCompletionContext
  ): { suggestions: MonacoCompletionItem[] } {
    if (!this.config.autocompleteEnabled) {
      return { suggestions: [] };
    }

    const monaco = window.monaco;
    if (!monaco) return { suggestions: [] };

    const kinds = monaco.languages.CompletionItemKind;
    const rules = monaco.languages.CompletionItemInsertTextRule;

    const fullCode = model.getValue();
    const currentLineNumber = position.lineNumber;
    const lineContent = model.getLineContent(currentLineNumber);
    const lineUntilCursor = lineContent.substring(0, position.column - 1);

    // Suppress suggestions right after '>' unless it's an arrow operator '->'
    if (lineUntilCursor.endsWith('>') && !lineUntilCursor.endsWith('->')) {
      return { suggestions: [] };
    }

    const suggestions: MonacoCompletionItem[] = [];

    // Parse current accessible variables in scope
    const inScopeVars = CppParser.getVariablesInScope(fullCode, currentLineNumber);

    // 1. Check if trigger character is member access '.' or '->'
    const dotMatch = lineUntilCursor.match(/([a-zA-Z0-9_\[\]\.\->]+)(\.|\->)$/);
    if (dotMatch) {
      const expr = dotMatch[1];
      const inferredBaseType = CppParser.inferType(expr, inScopeVars);

      if (inferredBaseType && STL_DEFINITIONS[inferredBaseType]) {
        const methods = STL_DEFINITIONS[inferredBaseType];
        methods.forEach((m, idx) => {
          suggestions.push({
            label: m.label,
            kind: kinds.Method,
            detail: `[${inferredBaseType}] ${m.detail}`,
            documentation: { value: m.documentation },
            insertText: m.insertText,
            insertTextRules: m.insertText.includes('$') ? rules.InsertAsSnippet : undefined,
            sortText: `00_${String(idx).padStart(3, '0')}_${m.label}`,
          });
        });
        return { suggestions };
      }
    }

    // 2. In-Scope Variables completions
    inScopeVars.forEach((v, idx) => {
      suggestions.push({
        label: v.name,
        kind: kinds.Variable,
        detail: `[Scope Var] ${v.type}`,
        documentation: `Declared on line ${v.line} (${v.type})`,
        insertText: v.name,
        sortText: `01_${String(idx).padStart(3, '0')}_${v.name}`,
      });
    });

    // 3. Primitive C++ Type completions (int, double, float, char, bool, etc.)
    const PRIMITIVE_TYPES = [
      { label: 'int', detail: '32-bit signed integer' },
      { label: 'long', detail: 'Signed integer' },
      { label: 'long long', detail: '64-bit signed integer' },
      { label: 'double', detail: 'Double-precision floating-point' },
      { label: 'float', detail: 'Single-precision floating-point' },
      { label: 'char', detail: 'Character type' },
      { label: 'bool', detail: 'Boolean type' },
      { label: 'void', detail: 'Empty type' },
      { label: 'size_t', detail: 'Unsigned size integer' },
      { label: 'uint64_t', detail: '64-bit unsigned integer' },
      { label: 'int64_t', detail: '64-bit signed integer' },
      { label: 'auto', detail: 'Automatic type deduction' },
      { label: 'const', detail: 'Const type qualifier' },
      { label: 'unsigned', detail: 'Unsigned integer modifier' }
    ];

    PRIMITIVE_TYPES.forEach(pt => {
      suggestions.push({
        label: pt.label,
        kind: kinds.Keyword,
        detail: `[Type] ${pt.detail}`,
        documentation: `C++ fundamental type: ${pt.label}`,
        insertText: pt.label,
        sortText: `02_${pt.label}`,
      });
    });

    // 4. STL Type Name completions (vector, string, map, unordered_map, set, stack, queue, etc.)
    const stlTypeNames = Object.keys(STL_DEFINITIONS).filter(k => !k.includes('::'));
    stlTypeNames.forEach(tName => {
      suggestions.push({
        label: tName,
        kind: kinds.Class,
        detail: `[STL Type] ${tName}`,
        documentation: `Standard C++ STL type: ${tName}`,
        insertText: tName,
        sortText: `02_${tName}`,
      });
    });

    // 4. Competitive Programming Snippets
    if (this.config.snippetsEnabled) {
      CP_SNIPPETS.forEach((s, idx) => {
        suggestions.push({
          label: s.label,
          kind: kinds.Snippet,
          detail: `[Snippet] ${s.detail}`,
          documentation: { value: s.documentation },
          insertText: s.insertText,
          insertTextRules: rules.InsertAsSnippet,
          sortText: `03_${String(idx).padStart(3, '0')}_${s.label}`,
        });
      });
    }

    return { suggestions };
  }
}
