import { LeetSenseProvider } from '../engine/completionProvider';

(() => {
  console.log('[LeetSense] Initializing main world Monaco provider...');

  const provider = new LeetSenseProvider();
  let registeredDisposable: { dispose(): void } | null = null;
  let isRegistered = false;

  function registerMonacoProvider() {
    if (isRegistered || !window.monaco || !window.monaco.languages) return;

    try {
      registeredDisposable = window.monaco.languages.registerCompletionItemProvider('cpp', {
        triggerCharacters: provider.triggerCharacters,
        provideCompletionItems: (model, position, context) => {
          return provider.provideCompletionItems(model, position, context);
        }
      });
      isRegistered = true;
      console.log('[LeetSense] Successfully registered C++ Monaco completion provider.');
    } catch (err) {
      console.error('[LeetSense] Failed to register Monaco completion provider:', err);
    }
  }

  // Poll for Monaco editor initialization on LeetCode SPA
  const checkInterval = setInterval(() => {
    if (window.monaco && window.monaco.languages) {
      registerMonacoProvider();
    }
  }, 1000);

  // Listen for config updates from content script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data && event.data.type === 'LEETSENSE_CONFIG_UPDATE') {
      const config = event.data.config;
      if (config) {
        provider.updateConfig(config);
        console.log('[LeetSense] Updated completion provider configuration:', config);
      }
    }
  });

  // Observe SPA DOM mutations to re-ensure registration if editor re-initializes
  const observer = new MutationObserver(() => {
    if (window.monaco && window.monaco.languages && !isRegistered) {
      registerMonacoProvider();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
