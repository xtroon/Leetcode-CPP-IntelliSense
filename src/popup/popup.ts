document.addEventListener('DOMContentLoaded', () => {
  const enableAutocomplete = document.getElementById('enableAutocomplete') as HTMLInputElement;
  const enableSnippets = document.getElementById('enableSnippets') as HTMLInputElement;
  const enableScopeAwareness = document.getElementById('enableScopeAwareness') as HTMLInputElement;

  const defaults = {
    enableAutocomplete: true,
    enableSnippets: true,
    enableScopeAwareness: true
  };

  chrome.storage.sync.get(defaults, (items) => {
    enableAutocomplete.checked = items.enableAutocomplete;
    enableSnippets.checked = items.enableSnippets;
    enableScopeAwareness.checked = items.enableScopeAwareness;
  });

  const saveOptions = () => {
    chrome.storage.sync.set({
      enableAutocomplete: enableAutocomplete.checked,
      enableSnippets: enableSnippets.checked,
      enableScopeAwareness: enableScopeAwareness.checked
    });
  };

  enableAutocomplete.addEventListener('change', saveOptions);
  enableSnippets.addEventListener('change', saveOptions);
  enableScopeAwareness.addEventListener('change', saveOptions);
});
