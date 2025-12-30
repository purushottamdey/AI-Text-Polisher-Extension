// Content script - runs on all pages
let selectionButton = null;
let suggestionPanel = null;
let selectedText = '';
let selectionRange = null;
let isInitialized = false;

console.log('AI Text Polisher: Content script loaded on', window.location.href);

// Initialize the extension
function initializeExtension() {
  if (isInitialized) return;
  
  console.log('AI Text Polisher: Initializing...');
  
  // Listen for text selection
  document.addEventListener('mouseup', handleTextSelection, true);
  document.addEventListener('keyup', handleTextSelection, true);
  
  // Also listen for selection change event (works better on some sites)
  document.addEventListener('selectionchange', debounce(handleTextSelection, 300), true);
  
  isInitialized = true;
  console.log('AI Text Polisher: Initialized successfully');
}

// Wait for page to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

// Re-initialize on dynamic content changes (for SPAs like Confluence)
const observer = new MutationObserver(debounce(() => {
  if (!isInitialized && document.body) {
    initializeExtension();
  }
}, 1000));

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
}

// Debounce function to avoid too many calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function handleTextSelection(e) {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  console.log('Selection changed, text length:', text.length);

  // Remove button if no text is selected
  if (!text) {
    removeSelectionButton();
    return;
  }

  // Store the selected text and range
  selectedText = text;
  try {
    selectionRange = selection.getRangeAt(0);
  } catch (error) {
    console.error('Error getting selection range:', error);
    return;
  }

  // Don't show button if selection is inside our own UI
  if (e.target && (e.target.closest('.ai-text-polisher-button') || 
      e.target.closest('.ai-suggestion-panel'))) {
    return;
  }

  // Show the suggestion button
  showSelectionButton(selection);
}

function showSelectionButton(selection) {
  removeSelectionButton();

  try {
    // Ensure we have a valid body element
    if (!document.body) {
      console.warn('Document body not available yet');
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Don't show button if selection has no size (can happen in some editors)
    if (rect.width === 0 || rect.height === 0) {
      console.log('Selection has no dimensions, skipping button');
      return;
    }

    selectionButton = document.createElement('button');
    selectionButton.className = 'ai-text-polisher-button';
    selectionButton.innerHTML = '✨ Polish Text';
    selectionButton.title = 'Get AI suggestions to improve this text';

    // Position the button above the selection with better calculation
    const buttonTop = rect.top + window.scrollY - 45;
    const buttonLeft = rect.left + window.scrollX;

    selectionButton.style.position = 'absolute';
    selectionButton.style.left = `${buttonLeft}px`;
    selectionButton.style.top = `${buttonTop}px`;
    selectionButton.style.zIndex = '2147483647'; // Maximum z-index

    selectionButton.addEventListener('click', handlePolishRequest, true);
    
    // Append to body with error handling
    document.body.appendChild(selectionButton);
    console.log('Button created at position:', buttonLeft, buttonTop);
  } catch (error) {
    console.error('Error showing selection button:', error);
  }
}

function removeSelectionButton() {
  if (selectionButton) {
    selectionButton.remove();
    selectionButton = null;
  }
}

async function handlePolishRequest(e) {
  e.preventDefault();
  e.stopPropagation();

  if (!selectedText) {
    return;
  }

  console.log('Polish button clicked, selected text:', selectedText.substring(0, 50) + '...');

  // Check if settings are configured
  const settings = await chrome.storage.sync.get(['aiProvider', 'apiKey']);
  
  if (!settings.apiKey) {
    showError('Please configure your AI settings first. Click the extension icon to set up.');
    return;
  }

  console.log('Settings check passed, sending message to background...');

  // Show loading state
  showSuggestionPanel('loading');

  // Send request to background script with timeout
  try {
    let responseReceived = false;
    
    // Set a timeout to detect if background doesn't respond
    const timeoutId = setTimeout(() => {
      if (!responseReceived) {
        console.error('Timeout: No response from background script');
        showSuggestionPanel('error', 'Request timed out. The background script may not be running. Try reloading the extension at chrome://extensions/');
      }
    }, 60000); // 60 second timeout for long texts

    chrome.runtime.sendMessage({
      action: 'polishText',
      text: selectedText
    }, (response) => {
      responseReceived = true;
      clearTimeout(timeoutId);
      
      // Check for Chrome runtime errors
      if (chrome.runtime.lastError) {
        console.error('Chrome runtime error:', chrome.runtime.lastError);
        showSuggestionPanel('error', 'Extension error: ' + chrome.runtime.lastError.message + '. Try reloading the extension at chrome://extensions/');
        return;
      }

      // Check if we got a response
      if (!response) {
        console.error('No response from background script');
        showSuggestionPanel('error', 'No response from AI service. The background script may have crashed. Go to chrome://extensions/ and click "service worker" to check for errors, then reload the extension.');
        return;
      }

      console.log('Received response:', response);

      if (response.error) {
        showSuggestionPanel('error', response.error);
      } else if (response.polishedText) {
        showSuggestionPanel('success', response.polishedText);
      } else {
        showSuggestionPanel('error', 'Invalid response format. Response: ' + JSON.stringify(response));
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    showSuggestionPanel('error', 'Failed to communicate with AI service: ' + error.message);
  }
}

function showSuggestionPanel(state, content = '') {
  removeSuggestionPanel();

  // Ensure we have a valid body element
  if (!document.body) {
    console.error('Cannot show panel: document.body not available');
    return;
  }

  suggestionPanel = document.createElement('div');
  suggestionPanel.className = 'ai-suggestion-panel';

  const buttonRect = selectionButton ? selectionButton.getBoundingClientRect() : { left: 100, top: 100 };
  
  suggestionPanel.style.position = 'absolute';
  suggestionPanel.style.left = `${buttonRect.left + window.scrollX}px`;
  suggestionPanel.style.top = `${buttonRect.top + window.scrollY + 35}px`;
  suggestionPanel.style.zIndex = '2147483647';

  if (state === 'loading') {
    suggestionPanel.innerHTML = `
      <div class="panel-header">
        <span class="panel-title">✨ AI is polishing your text...</span>
        <button class="panel-close" onclick="this.closest('.ai-suggestion-panel').remove()">×</button>
      </div>
      <div class="panel-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">Generating suggestions...</p>
      </div>
    `;
  } else if (state === 'error') {
    suggestionPanel.innerHTML = `
      <div class="panel-header error-header">
        <span class="panel-title">❌ Error</span>
        <button class="panel-close" onclick="this.closest('.ai-suggestion-panel').remove()">×</button>
      </div>
      <div class="panel-content">
        <p class="error-text">${content}</p>
      </div>
    `;
  } else if (state === 'success') {
    suggestionPanel.innerHTML = `
      <div class="panel-header">
        <span class="panel-title">✨ Polished Version</span>
        <button class="panel-close">×</button>
      </div>
      <div class="panel-content">
        <div class="original-text">
          <strong>Original:</strong>
          <p>${escapeHtml(selectedText)}</p>
        </div>
        <div class="polished-text">
          <strong>Polished:</strong>
          <p>${escapeHtml(content)}</p>
        </div>
        <div class="panel-actions">
          <button class="copy-btn" data-text="${escapeHtml(content)}">📋 Copy</button>
          <button class="replace-btn" data-text="${escapeHtml(content)}">✓ Replace</button>
        </div>
      </div>
    `;

    // Add event listeners
    suggestionPanel.querySelector('.panel-close').addEventListener('click', removeSuggestionPanel);
    suggestionPanel.querySelector('.copy-btn').addEventListener('click', copyToClipboard);
    suggestionPanel.querySelector('.replace-btn').addEventListener('click', replaceSelectedText);
  }

  document.body.appendChild(suggestionPanel);
}

function removeSuggestionPanel() {
  if (suggestionPanel) {
    suggestionPanel.remove();
    suggestionPanel = null;
  }
}

function copyToClipboard(e) {
  const text = e.target.getAttribute('data-text');
  navigator.clipboard.writeText(text).then(() => {
    e.target.textContent = '✓ Copied!';
    setTimeout(() => {
      e.target.textContent = '📋 Copy';
    }, 2000);
  });
}

function replaceSelectedText(e) {
  const newText = e.target.getAttribute('data-text');
  
  if (selectionRange) {
    // Try to replace the text in the original location
    try {
      selectionRange.deleteContents();
      selectionRange.insertNode(document.createTextNode(newText));
      
      // Close the panel
      removeSuggestionPanel();
      removeSelectionButton();
      
      // Show success message
      showNotification('✓ Text replaced successfully!');
    } catch (error) {
      // If replacement fails, just copy to clipboard
      navigator.clipboard.writeText(newText);
      showNotification('Text copied to clipboard (could not replace in this field)');
    }
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'ai-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function showError(message) {
  showNotification('❌ ' + message);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Close panels when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.ai-text-polisher-button') && 
      !e.target.closest('.ai-suggestion-panel')) {
    removeSelectionButton();
    removeSuggestionPanel();
  }
});
