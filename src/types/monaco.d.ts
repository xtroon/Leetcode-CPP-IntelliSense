export interface MonacoCompletionItem {
  label: string;
  kind: number;
  documentation?: string | { value: string };
  detail?: string;
  insertText: string;
  insertTextRules?: number;
  sortText?: string;
  filterText?: string;
  range?: any;
}

export interface MonacoPosition {
  lineNumber: number;
  column: number;
}

export interface MonacoModel {
  getValue(): string;
  getValueInRange(range: any): string;
  getLineContent(lineNumber: number): string;
  getLanguageId(): string;
}

export interface MonacoCompletionContext {
  triggerKind: number;
  triggerCharacter?: string;
}

export interface MonacoCancellationToken {
  isCancellationRequested: boolean;
}

export interface MonacoCompletionProvider {
  triggerCharacters?: string[];
  provideCompletionItems(
    model: MonacoModel,
    position: MonacoPosition,
    context: MonacoCompletionContext,
    token: MonacoCancellationToken
  ): { suggestions: MonacoCompletionItem[] } | Promise<{ suggestions: MonacoCompletionItem[] }>;
}

export interface MonacoEditorInstance {
  getModel(): MonacoModel | null;
  onDidModelChange?(listener: () => void): void;
}

export interface MonacoNamespace {
  languages: {
    registerCompletionItemProvider(
      languageId: string,
      provider: MonacoCompletionProvider
    ): { dispose(): void };
    CompletionItemKind: {
      Text: number;
      Method: number;
      Function: number;
      Constructor: number;
      Field: number;
      Variable: number;
      Class: number;
      Interface: number;
      Module: number;
      Property: number;
      Unit: number;
      Value: number;
      Enum: number;
      Keyword: number;
      Snippet: number;
      Color: number;
      File: number;
      Reference: number;
      Folder: number;
      EnumMember: number;
      Constant: number;
      Struct: number;
      Event: number;
      Operator: number;
      TypeParameter: number;
    };
    CompletionItemInsertTextRule: {
      KeepWhitespace: number;
      InsertAsSnippet: number;
    };
  };
  editor: {
    getEditors(): MonacoEditorInstance[];
    onDidCreateEditor?(listener: (editor: MonacoEditorInstance) => void): void;
  };
}

declare global {
  interface Window {
    monaco?: MonacoNamespace;
  }
}
