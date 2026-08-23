import { createCppCompletionProvider, CompletionProviderOptions } from '../engine/completionProvider';

(function () {
  if (window.__LEETSENSE_LOADED__) return;
  window.__LEETSENSE_LOADED__ = true;

  console.log('[Leetcode C++ Intellisense] Main world script starting...');

  // Options state
  let currentOptions: CompletionProviderOptions = {
    enableAutocomplete: true,
    enableSnippets: true,
    enableScopeAwareness: true
  };

  // Listen to configuration messages from content script
  window.addEventListener('message', (event) => {
    if (event.source !== window || !event.data || event.data.type !== 'LEETSENSE_SETTINGS_UPDATE') {
      return;
    }
    if (event.data.payload) {
      currentOptions = { ...currentOptions, ...event.data.payload };
      console.log('[Leetcode C++ Intellisense] Options updated:', currentOptions);
    }
  });

  const registeredLanguages = new Set<string>();

  function registerForLanguage(languageId: string) {
    if (registeredLanguages.has(languageId)) return;
    if (!window.monaco || !window.monaco.languages ||
        typeof window.monaco.languages.registerCompletionItemProvider !== 'function') return;

    try {
      const provider = createCppCompletionProvider(window.monaco, () => currentOptions);
      window.monaco.languages.registerCompletionItemProvider(languageId, provider);
      registeredLanguages.add(languageId);
      console.log(`[Leetcode C++ Intellisense] Registered completion provider for language: "${languageId}"`);
    } catch (err) {
      console.error(`[Leetcode C++ Intellisense] Failed to register for "${languageId}":`, err);
    }
  }

  function hookEditor(editor: any) {
    if (!editor || editor.__LEETSENSE_HOOKED__) return;
    editor.__LEETSENSE_HOOKED__ = true;

    try {
      editor.updateOptions({
        quickSuggestions: {
          other: 'on',
          comments: 'off',
          strings: 'off'
        },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',
        wordBasedSuggestions: 'allDocuments'
      });
      console.log('[Leetcode C++ Intellisense] Configured editor options (quickSuggestions: ON)');
    } catch (e) {
      // Ignore updateOptions error
    }

    try {
      editor.onDidChangeModelContent((event: any) => {
        if (!event || !event.changes || event.changes.length === 0) return;
        const change = event.changes[0];
        const text = change.text;
        // Only trigger on letters, numbers, underscore, dot or arrow
        if (text && text.length === 1 && /[a-zA-Z0-9_.]/.test(text)) {
          setTimeout(() => {
            try {
              editor.trigger('leetsense', 'editor.action.triggerSuggest', {});
            } catch (err) {
              // Ignore
            }
          }, 10);
        }
      });
    } catch (e) {
      // Ignore listener error
    }
  }

  function initMonaco() {
    if (!window.monaco || !window.monaco.languages ||
        typeof window.monaco.languages.registerCompletionItemProvider !== 'function') return false;

    // Register wildcard '*' for ALL languages in Monaco
    registerForLanguage('*');

    // Register known C++ variants
    ['cpp', 'c_cpp', 'c', 'plaintext'].forEach(lang => registerForLanguage(lang));

    // Register all registered languages in Monaco engine
    if (window.monaco.languages.getLanguages) {
      const langs = window.monaco.languages.getLanguages();
      langs.forEach((l: any) => {
        if (l.id) registerForLanguage(l.id);
      });
    }

    // Hook all active editor instances
    if (window.monaco.editor) {
      if (window.monaco.editor.getEditors) {
        const editors = window.monaco.editor.getEditors();
        editors.forEach((ed: any) => hookEditor(ed));
      }

      if (!window.monaco.__LEETSENSE_EDITOR_LISTENER__) {
        window.monaco.__LEETSENSE_EDITOR_LISTENER__ = true;
        if (window.monaco.editor.onDidCreateEditor) {
          window.monaco.editor.onDidCreateEditor((ed: any) => hookEditor(ed));
        }
      }

      // Check models & listen to language change
      if (window.monaco.editor.getModels) {
        const models = window.monaco.editor.getModels();
        models.forEach((model: any) => {
          const langId = model.getLanguageId();
          if (langId) registerForLanguage(langId);

          if (!model.__LEETSENSE_LANG_LISTENER__) {
            model.__LEETSENSE_LANG_LISTENER__ = true;
            if (model.onDidChangeLanguage) {
              model.onDidChangeLanguage((e: any) => {
                if (e.newLanguage) registerForLanguage(e.newLanguage);
              });
            }
          }
        });

        if (!window.monaco.__LEETSENSE_MODEL_LISTENER__) {
          window.monaco.__LEETSENSE_MODEL_LISTENER__ = true;
          window.monaco.editor.onDidCreateModel((model: any) => {
            const langId = model.getLanguageId();
            if (langId) registerForLanguage(langId);
          });
        }
      }
    }

    return registeredLanguages.size > 0;
  }

  // Periodic polling to hook dynamic Monaco creation and SPA problem transitions
  setInterval(() => {
    initMonaco();
    if (window.monaco && window.monaco.editor && window.monaco.editor.getEditors) {
      window.monaco.editor.getEditors().forEach((ed: any) => hookEditor(ed));
    }
  }, 1000);

  // MutationObserver for dynamic LeetCode DOM changes
  const observer = new MutationObserver(() => {
    initMonaco();
  });

  const target = document.body || document.documentElement;
  if (target) {
    observer.observe(target, { childList: true, subtree: true });
  }
})();
