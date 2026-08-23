(() => {
  console.log('[LeetSense] Content script loaded (ISOLATED world).');

  // Load initial settings and relay to MAIN world script
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['autocompleteEnabled', 'snippetsEnabled'], (items) => {
      const config = {
        autocompleteEnabled: items.autocompleteEnabled ?? true,
        snippetsEnabled: items.snippetsEnabled ?? true,
      };
      window.postMessage({ type: 'LEETSENSE_CONFIG_UPDATE', config }, '*');
    });

    // Listen for setting changes from Extension Popup UI
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        chrome.storage.local.get(['autocompleteEnabled', 'snippetsEnabled'], (items) => {
          const config = {
            autocompleteEnabled: items.autocompleteEnabled ?? true,
            snippetsEnabled: items.snippetsEnabled ?? true,
          };
          window.postMessage({ type: 'LEETSENSE_CONFIG_UPDATE', config }, '*');
        });
      }
    });
  }
})();
