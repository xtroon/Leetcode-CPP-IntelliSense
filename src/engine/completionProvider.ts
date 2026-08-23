import { STL_TYPES, CPP_KEYWORDS, STLMethod } from './stlDefinitions';
import { CP_SNIPPETS } from './snippets';
import { parseVariables, getTriggerContext, isFuzzyMatch, levenshteinDistance, VariableSymbol } from './cppParser';

export interface CompletionProviderOptions {
  enableAutocomplete: boolean;
  enableSnippets: boolean;
  enableScopeAwareness: boolean;
}

export function createCppCompletionProvider(
  monaco: any,
  getOptions: () => CompletionProviderOptions
) {
  const kinds = monaco.languages ? monaco.languages.CompletionItemKind : {
    Method: 0,
    Function: 1,
    Variable: 4,
    Class: 5,
    Constant: 14,
    Keyword: 13,
    Snippet: 27
  };

  const insertAsSnippet = (monaco.languages && monaco.languages.CompletionItemInsertTextRule)
    ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    : 4;

  return {
    triggerCharacters: ['.', '>', ':'],

    provideCompletionItems: (model: any, position: any) => {
      try {
        const options = getOptions();
        if (!options.enableAutocomplete) {
          return { suggestions: [] };
        }

        const fullCode = model.getValue();
        const cursorOffset = model.getOffsetAt(position);
        const lineContent = model.getLineContent(position.lineNumber);
        const lineUntilPosition = lineContent.substring(0, position.column - 1);

        // Get current word at position
        const word = model.getWordUntilPosition(position);

        // Standard Monaco Range construction
        const range = monaco.Range
          ? new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn)
          : {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn
            };

        // Parse variables in current file up to cursor
        const variables: VariableSymbol[] = options.enableScopeAwareness
          ? parseVariables(fullCode, cursorOffset)
          : parseVariables(fullCode, fullCode.length);

        // Check if user typed '.' or '->'
        const triggerContext = getTriggerContext(lineUntilPosition, variables);

        // =========================================================================
        // 1. MEMBER ACCESS (nums. or vnums. or ptr->): SHOW ONLY CONTAINER METHODS
        // =========================================================================
        if (triggerContext.isMemberAccess) {
          const suggestions: any[] = [];
          const baseType = triggerContext.baseType;
          const memberPrefix = triggerContext.memberPrefix || '';

          // If the variable does not match any declared variable (even after typo checking)
          if (!baseType || !STL_TYPES[baseType]) {
            console.log(`[Leetcode C++ Intellisense] Member access for unknown variable "${triggerContext.targetExpr}". No suggestions.`);
            return { suggestions: [], incomplete: false };
          }

          const methods = STL_TYPES[baseType];

          // Filter methods based on typed member prefix (e.g. nums.pu -> push_back, pop_back)
          const filteredMethods = methods.filter((m) => {
            if (!memberPrefix) return true;
            const mName = m.name.toLowerCase();
            const prefix = memberPrefix.toLowerCase();
            if (mName.startsWith(prefix)) return true;
            if (isFuzzyMatch(prefix, mName)) return true;
            if (levenshteinDistance(prefix, mName.substring(0, prefix.length)) <= 1) return true;
            return false;
          });

          // Deduplicate methods
          const seenMethods = new Set<string>();
          filteredMethods.forEach((m) => {
            if (!seenMethods.has(m.name)) {
              seenMethods.add(m.name);
              suggestions.push({
                label: m.name,
                kind: kinds.Method,
                detail: m.signature,
                documentation: { value: `**${m.signature}**\n\n${m.doc}` },
                insertText: m.insertSnippet,
                insertTextRules: insertAsSnippet,
                sortText: `0_${m.name}`,
                filterText: m.name,
                range: range
              });
            }
          });

          console.log(`[Leetcode C++ Intellisense] Member access for "${triggerContext.targetExpr}" -> resolved as "${triggerContext.matchedVariable || triggerContext.targetExpr}" (${baseType}). Returning ${suggestions.length} methods.`);
          return { suggestions, incomplete: false };
        }

        // =========================================================================
        // 2. GENERAL AUTOCOMPLETE (Variables, Types, Constants, Functions, Snippets)
        // =========================================================================
        const suggestions: any[] = [];

        // Rank 1: In-scope local variables and parameters
        variables.forEach((v) => {
          suggestions.push({
            label: v.name,
            kind: kinds.Variable,
            detail: `(variable) ${v.type}`,
            documentation: { value: `Declared in scope as \`${v.type} ${v.name}\`` },
            insertText: v.name,
            sortText: `1_${v.name}`,
            filterText: v.name,
            range: range
          });
        });

        // Rank 2: C++ Built-in Types, Constants & Standard Functions (int, INT_MAX, double, sort, etc.)
        CPP_KEYWORDS.forEach((item) => {
          let itemKind = kinds.Keyword;
          if (item.kind === 'type') itemKind = kinds.Class;
          else if (item.kind === 'constant') itemKind = kinds.Constant || kinds.Variable;
          else if (item.kind === 'function') itemKind = kinds.Function;

          const isFunctionSnippet = item.insertText.includes('${');

          suggestions.push({
            label: item.label,
            kind: itemKind,
            detail: item.detail,
            documentation: { value: `**${item.label}** (${item.detail})\n\n${item.doc}` },
            insertText: item.insertText,
            insertTextRules: isFunctionSnippet ? insertAsSnippet : undefined,
            sortText: `2_${item.label}`,
            filterText: item.label,
            range: range
          });
        });

        // Rank 3: Competitive Programming Snippets (fori, fore, pb, sortv, etc.)
        if (options.enableSnippets) {
          CP_SNIPPETS.forEach((s) => {
            suggestions.push({
              label: s.label,
              kind: kinds.Snippet,
              detail: `[CP Snippet] ${s.detail}`,
              documentation: { value: `**${s.label}**: ${s.documentation}` },
              insertText: s.snippet,
              insertTextRules: insertAsSnippet,
              sortText: `3_${s.label}`,
              filterText: s.label,
              range: range
            });
          });
        }

        // Rank 4: C++ STL Container Types (vector, string, unordered_map, etc.)
        Object.keys(STL_TYPES).forEach((type) => {
          suggestions.push({
            label: type,
            kind: kinds.Class,
            detail: `std::${type}`,
            documentation: { value: `Standard C++ STL container \`std::${type}\`` },
            insertText: type,
            sortText: `4_${type}`,
            filterText: type,
            range: range
          });
        });

        return { suggestions, incomplete: false };
      } catch (err) {
        console.error('[Leetcode C++ Intellisense] Completion provider error:', err);
        return { suggestions: [] };
      }
    }
  };
}
