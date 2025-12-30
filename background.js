// Background service worker - handles API calls
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'polishText') {
    console.log('Received polishText request:', request);
    polishText(request.text)
      .then(polishedText => {
        console.log('Successfully polished text');
        sendResponse({ polishedText });
      })
      .catch(error => {
        console.error('Error polishing text:', error);
        sendResponse({ error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

async function polishText(text) {
  console.log('Starting polishText with:', text.substring(0, 50) + '...');
  
  // Get settings from storage
  const settings = await chrome.storage.sync.get([
    'aiProvider',
    'apiKey',
    'customEndpoint',
    'modelName',
    'customPrompt'
  ]);

  console.log('Loaded settings:', { 
    aiProvider: settings.aiProvider, 
    hasApiKey: !!settings.apiKey,
    modelName: settings.modelName 
  });

  if (!settings.apiKey) {
    throw new Error('API key not configured. Please set up your AI provider in the extension settings.');
  }

  const provider = settings.aiProvider || 'openai';
  console.log('Using provider:', provider);
  
  switch (provider) {
    case 'openai':
      return await callOpenAI(text, settings);
    case 'anthropic':
      return await callAnthropic(text, settings);
    case 'gemini':
      return await callGemini(text, settings);
    case 'custom':
      return await callCustomAPI(text, settings);
    default:
      throw new Error('Unknown AI provider');
  }
}

async function callOpenAI(text, settings) {
  const model = settings.modelName || 'gpt-4o-mini';
  const systemPrompt = settings.customPrompt || 
    'You are a writing assistant that polishes and improves text. Make it more professional, clear, and well-written while maintaining the original meaning and tone. Return only the improved text without any explanations or additional commentary.';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Polish this text:\n\n${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 8192
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function callAnthropic(text, settings) {
  const model = settings.modelName || 'claude-3-5-sonnet-20241022';
  const systemPrompt = settings.customPrompt || 
    'You are a writing assistant that polishes and improves text. Make it more professional, clear, and well-written while maintaining the original meaning and tone. Return only the improved text without any explanations or additional commentary.';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': settings.apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Polish this text:\n\n${text}`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Anthropic API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text.trim();
}

async function callGemini(text, settings) {
  // Clean model name - remove 'models/' prefix if user added it
  let model = settings.modelName || 'gemini-2.0-flash';
  
  // Aggressively clean the model name
  model = model.trim();
  model = model.replace(/^models\//, ''); // Remove 'models/' prefix
  model = model.replace(/-latest$/, ''); // Remove '-latest' suffix
  
  // If empty after cleaning, use default
  if (!model) {
    model = 'gemini-2.0-flash';
  }
  
  console.log('Original model from settings:', settings.modelName);
  console.log('Cleaned model name:', model);
  
  const systemPrompt = settings.customPrompt || 
    'You are a professional writing assistant. Your task is to improve and polish the given text. Return ONLY the improved version of the text - do not add explanations, options, commentary, or any other text. Just return the polished version directly.';

  // Use v1beta API (same as your curl command)
  const apiVersion = 'v1beta';
  const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent`;
  
  const requestBody = {
    contents: [{
      parts: [{
        text: `${systemPrompt}\n\nPolish this text:\n\n${text}`
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192  // Support for long text rewrites
    }
  };

  console.log('Calling Gemini API:', { 
    originalModel: settings.modelName,
    cleanedModel: model, 
    apiVersion, 
    url: url
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': settings.apiKey
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  console.log('Gemini API response:', data);

  if (!response.ok) {
    let errorMsg = data.error?.message || `Gemini API error: ${response.status} ${response.statusText}`;
    
    // Add helpful suggestion for model errors
    if (errorMsg.includes('not found') || errorMsg.includes('not supported')) {
      errorMsg += '\n\n✅ Try these working models:\n• gemini-1.5-flash (recommended - fast & free)\n• gemini-1.5-pro (better quality)\n• gemini-2.0-flash-exp (experimental)\n\n📝 How to fix:\n1. Click extension icon\n2. Clear the Model Name field (leave blank)\n3. Click Save\n4. Try again';
    }
    
    throw new Error(errorMsg);
  }

  // Check if response has expected structure
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
    console.error('Unexpected Gemini response structure:', data);
    throw new Error('Unexpected response from Gemini API. Check console for details.');
  }

  const polishedText = data.candidates[0].content.parts[0].text.trim();
  
  // Check if response was cut off due to token limit
  if (data.candidates[0].finishReason === 'MAX_TOKENS') {
    console.warn('Response may be incomplete - hit token limit');
  }
  
  console.log('Polished text length:', polishedText.length, 'characters');
  
  return polishedText;
}

async function callCustomAPI(text, settings) {
  if (!settings.customEndpoint) {
    throw new Error('Custom API endpoint not configured');
  }

  const systemPrompt = settings.customPrompt || 
    'You are a writing assistant that polishes and improves text. Make it more professional, clear, and well-written while maintaining the original meaning and tone. Return only the improved text without any explanations or additional commentary.';

  // Attempt OpenAI-compatible format first
  const response = await fetch(settings.customEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify({
      model: settings.modelName || 'default',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Polish this text:\n\n${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 8192
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Custom API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // Try to extract response from common formats
  if (data.choices && data.choices[0]?.message?.content) {
    return data.choices[0].message.content.trim();
  } else if (data.content && data.content[0]?.text) {
    return data.content[0].text.trim();
  } else if (data.response) {
    return data.response.trim();
  } else if (data.text) {
    return data.text.trim();
  }
  
  throw new Error('Unable to parse response from custom API');
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open settings page on first install
    chrome.runtime.openOptionsPage();
  }
});
