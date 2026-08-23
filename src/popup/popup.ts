document.addEventListener('DOMContentLoaded', () => {
  const autoEl = document.getElementById('toggle-autocomplete') as HTMLInputElement | null;
  const snipEl = document.getElementById('toggle-snippets') as HTMLInputElement | null;

  if (!autoEl || !snipEl) return;

  // Load existing configuration
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['autocompleteEnabled', 'snippetsEnabled'], (result) => {
      autoEl.checked = result.autocompleteEnabled ?? true;
      snipEl.checked = result.snippetsEnabled ?? true;
    });
  }

  // Update storage on toggle change
  autoEl.addEventListener('change', () => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ autocompleteEnabled: autoEl.checked });
    }
  });

  snipEl.addEventListener('change', () => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ snippetsEnabled: snipEl.checked });
    }
  });
});
