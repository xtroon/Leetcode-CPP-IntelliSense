(function () {
  console.log('[LeetSense] Content script initializing...');

  // Function to inject main world script
  function injectScript(file: string) {
    const container = document.head || document.documentElement;
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.runtime.getURL(file));
    script.onload = function () {
      script.remove();
    };
    container.appendChild(script);
  }

  // Inject inject.js into main world context
  injectScript('inject.js');

  // Sync initial settings from chrome.storage
  const defaultSettings = {
    enableAutocomplete: true,
    enableSnippets: true,
    enableScopeAwareness: true
  };

  chrome.storage.sync.get(defaultSettings, (items) => {
    window.postMessage(
      {
        type: 'LEETSENSE_SETTINGS_UPDATE',
        payload: items
      },
      '*'
    );
  });

  // Listen for setting changes from popup
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
      chrome.storage.sync.get(defaultSettings, (items) => {
        window.postMessage(
          {
            type: 'LEETSENSE_SETTINGS_UPDATE',
            payload: items
          },
          '*'
        );
      });
    }
  });
})();
