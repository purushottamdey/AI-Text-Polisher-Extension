// Load saved settings when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await chrome.storage.sync.get([
    'aiProvider',
    'apiKey',
    'customEndpoint',
    'modelName',
    'customPrompt'
  ]);

  if (settings.aiProvider) {
    document.getElementById('ai-provider').value = settings.aiProvider;
    toggleCustomEndpoint(settings.aiProvider);
  }
  if (settings.apiKey) {
    document.getElementById('api-key').value = settings.apiKey;
  }
  if (settings.customEndpoint) {
    document.getElementById('custom-endpoint').value = settings.customEndpoint;
  }
  if (settings.modelName) {
    document.getElementById('model-name').value = settings.modelName;
  }
  if (settings.customPrompt) {
    document.getElementById('custom-prompt').value = settings.customPrompt;
  }
});

// Donate button toggle
document.getElementById('donate-btn').addEventListener('click', () => {
  const donateOptions = document.getElementById('donate-options');
  if (donateOptions.style.display === 'none') {
    donateOptions.style.display = 'block';
  } else {
    donateOptions.style.display = 'none';
  }
});

// Copy UPI ID functionality
document.getElementById('copy-upi').addEventListener('click', async () => {
  const upiId = 'dey.purushottam@ybl';
  try {
    await navigator.clipboard.writeText(upiId);
    const btn = document.getElementById('copy-upi');
    const originalText = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.background = '#27ae60';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '#667eea';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
});

// Toggle password visibility
document.getElementById('toggle-key').addEventListener('click', () => {
  const apiKeyInput = document.getElementById('api-key');
  const toggleBtn = document.getElementById('toggle-key');
  
  if (apiKeyInput.type === 'password') {
    apiKeyInput.type = 'text';
    toggleBtn.textContent = 'Hide';
  } else {
    apiKeyInput.type = 'password';
    toggleBtn.textContent = 'Show';
  }
});

// Show/hide custom endpoint field
document.getElementById('ai-provider').addEventListener('change', (e) => {
  toggleCustomEndpoint(e.target.value);
});

function toggleCustomEndpoint(provider) {
  const customGroup = document.getElementById('custom-endpoint-group');
  customGroup.style.display = provider === 'custom' ? 'block' : 'none';
}

// Save settings
document.getElementById('save-btn').addEventListener('click', async () => {
  const aiProvider = document.getElementById('ai-provider').value;
  const apiKey = document.getElementById('api-key').value;
  const customEndpoint = document.getElementById('custom-endpoint').value;
  let modelName = document.getElementById('model-name').value.trim();
  const customPrompt = document.getElementById('custom-prompt').value;

  if (!apiKey) {
    showStatus('Please enter an API key', 'error');
    return;
  }

  if (aiProvider === 'custom' && !customEndpoint) {
    showStatus('Please enter a custom API endpoint', 'error');
    return;
  }

  // Clean model name for Gemini
  if (aiProvider === 'gemini' && modelName) {
    // Remove common prefixes/suffixes that don't work
    modelName = modelName.replace(/^models\//, '');
    modelName = modelName.replace(/-latest$/, '');
    
    console.log('Cleaned model name:', modelName);
    
    // Update the field to show cleaned value
    document.getElementById('model-name').value = modelName;
  }

  await chrome.storage.sync.set({
    aiProvider,
    apiKey,
    customEndpoint,
    modelName,
    customPrompt
  });

  showStatus('Settings saved successfully!', 'success');
  
  setTimeout(() => {
    hideStatus();
  }, 3000);
});

function showStatus(message, type) {
  const statusEl = document.getElementById('status-message');
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;
}

function hideStatus() {
  const statusEl = document.getElementById('status-message');
  statusEl.style.display = 'none';
}
