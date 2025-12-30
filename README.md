# AI Text Polisher - Chrome Extension

A powerful Chrome extension that helps you polish and improve your writing using AI. Perfect for writing posts, Confluence pages, newsletters, emails, and any other content!

## ✨ Features

- **Smart Text Selection**: Simply select any text on any webpage to activate
- **AI-Powered Polishing**: Get instant AI suggestions to improve clarity, grammar, and style
- **Multiple AI Providers**: Built-in support for OpenAI (ChatGPT), Anthropic (Claude), Google Gemini, and custom APIs
- **Highly Customizable**: Configure your AI provider, API key, model name, and custom instructions
- **One-Click Actions**: Instantly replace selected text or copy polished version to clipboard
- **Universal Compatibility**: Works on all websites including Confluence, Gmail, social media, and text editors
- **Privacy-First**: API keys stored locally; data sent directly to your chosen AI provider
- **Dynamic Loading**: Smart detection works with single-page applications and dynamic content

## 🚀 Installation

### From Source (Development)

1. **Download/Clone** this extension folder to your computer

2. **Open Chrome** and navigate to `chrome://extensions/`

3. **Enable Developer Mode** (toggle in the top-right corner)

4. **Click "Load unpacked"** and select the `ChromeAdon` folder

5. **The extension is now installed!** You'll see the icon in your toolbar

## ⚙️ Setup

1. **Click the extension icon** in your Chrome toolbar

2. **Select your AI Provider**:
   - OpenAI (ChatGPT) - Recommended
   - Anthropic (Claude)
   - Google Gemini
   - Custom API endpoint

3. **Enter your API Key**:
   - For OpenAI: Get your API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - For Anthropic: Get your API key from [https://console.anthropic.com/](https://console.anthropic.com/)
   - For Gemini: Get your API key from [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

4. **(Optional) Configure**:
   - Model name (e.g., `gpt-4o`, `claude-3-5-sonnet-20241022`, `gemini-1.5-flash-latest`)
   - Custom instructions for the AI

5. **Click "Save Settings"**

## 📖 How to Use

1. **Select any text** on any webpage (emails, documents, social posts, etc.)

2. **Click the "✨ Polish Text" button** that appears near your text selection

3. **Wait for AI processing** - the polished text will appear in a suggestion panel

4. **Choose an action**:
   - **Replace**: Automatically replace the selected text with the polished version
   - **Copy**: Copy the polished text to your clipboard
   - **Close**: Dismiss the suggestion without making changes

5. **Done!** Your text is now polished and professional

### Tips for Best Results
- Select complete sentences or paragraphs
- The button appears automatically when you select text
- Works with contenteditable elements, textareas, and input fields
- For read-only fields, use the "Copy" button

## 🎯 Use Cases

- **Confluence Pages**: Polish technical documentation and wiki pages with better clarity
- **Email Writing**: Improve professional emails in Gmail, Outlook, or any webmail client
- **Social Media**: Craft engaging posts for LinkedIn, Twitter, Facebook, Instagram
- **Newsletters**: Create more compelling newsletter content with better flow
- **Blog Posts**: Refine articles and blog content for better readability
- **Comments & Replies**: Write more thoughtful and professional responses
- **Code Documentation**: Improve README files, code comments, and technical docs
- **Customer Support**: Polish support responses for clarity and professionalism
- **Content Marketing**: Enhance marketing copy, product descriptions, and landing pages
- **Academic Writing**: Improve essays, reports, and research summaries
- **Any Text Field**: Works on virtually any editable or selectable text on the web

## 🔑 API Keys & Privacy

- Your API keys are stored **locally** in your browser using Chrome's secure sync storage
- Your text is sent **directly** to your chosen AI provider (OpenAI, Anthropic, Google, or custom)
- **No intermediary servers** - direct provider communication only
- **Zero data collection** by this extension - no analytics, no tracking, no logging
- You maintain **full control** over your data, API usage, and associated costs
- Settings sync across your Chrome browsers when signed into Chrome (optional)

## 🛠️ Supported AI Providers

### OpenAI (ChatGPT)
- **Models**: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-3.5-turbo`, etc.
- **Website**: [https://platform.openai.com/](https://platform.openai.com/)
- **API Keys**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Recommended**: Best overall performance and reliability

### Anthropic (Claude)
- **Models**: `claude-3-5-sonnet-20241022`, `claude-3-opus-20240229`, `claude-3-haiku-20240307`, etc.
- **Website**: [https://www.anthropic.com/](https://www.anthropic.com/)
- **API Keys**: [https://console.anthropic.com/](https://console.anthropic.com/)
- **Note**: Excellent for nuanced and detailed text improvements

### Google Gemini
- **Models**: `gemini-1.5-flash-latest`, `gemini-1.5-pro-latest`, `gemini-2.0-flash-exp`, etc.
- **Website**: [https://ai.google.dev/](https://ai.google.dev/)
- **API Keys**: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **Tip**: Use `-latest` suffix for stable versions
- **Troubleshooting**: See [tests/TROUBLESHOOTING-GEMINI.md](tests/TROUBLESHOOTING-GEMINI.md) for common issues
- **Valid Models**: Check [tests/VALID-MODELS.txt](tests/VALID-MODELS.txt) for current list

### Custom API
- **Use Case**: Any OpenAI-compatible API endpoint
- **Perfect For**: Local LLMs (Ollama, LM Studio), custom AI services, or enterprise APIs
- **Configuration**: Simply provide your custom endpoint URL and API key format

## 💡 Tips

- **Use specific prompts**: Add custom instructions like "Make it more formal" or "Keep it casual and friendly"
- **Select wisely**: Select complete sentences or paragraphs for best results
- **Review before replacing**: Always review AI suggestions before replacing original text
- **Try different models**: Different AI models have different writing styles and strengths
- **Custom instructions**: Set default behavior in settings (e.g., "Always check for grammar errors")
- **Works on SPAs**: Automatically detects and works with single-page applications like Confluence

## 🐛 Troubleshooting

### Button doesn't appear
- Ensure the extension is enabled in `chrome://extensions/`
- Refresh the page after installing or enabling the extension
- Verify you've selected actual text content (not images, buttons, or other elements)
- Check browser console for any error messages (F12 → Console)

### API errors
- Verify your API key is correct in the extension settings
- Check you have sufficient credits/quota with your AI provider
- Ensure your API key has the correct permissions
- For Gemini: Make sure you're using a valid model name (see [tests/VALID-MODELS.txt](tests/VALID-MODELS.txt))
- Try the diagnostic tools ([tests/test-gemini.html](tests/test-gemini.html) or [tests/diagnostic.html](tests/diagnostic.html))

### Text won't replace
- Some fields (like password inputs or read-only elements) cannot be modified
- For these cases, use the "Copy" button instead
- The extension automatically falls back to clipboard if replacement fails
- Check that the element is actually editable (contenteditable, textarea, or input)

### Settings not saving
- Check that Chrome's storage quota hasn't been exceeded
- Try using the [tests/fix-settings.html](tests/fix-settings.html) utility
- Clear and re-enter your settings

### Need More Help?
- See [tests/TROUBLESHOOTING-GEMINI.md](tests/TROUBLESHOOTING-GEMINI.md) for Gemini-specific issues
- Check [tests/DEBUG-STEPS.txt](tests/DEBUG-STEPS.txt) for debugging guidance
- Review [tests/EXACT-STEPS.txt](tests/EXACT-STEPS.txt) for detailed usage steps

## 📋 Project Structure

```
ChromeAdon/
├── manifest.json              # Extension configuration (Manifest V3)
├── background.js              # Service worker - handles AI API calls
├── content.js                 # Content script - detects text selection & manages UI
├── content.css                # Styles for on-page elements (button & panel)
├── popup.html                 # Extension popup - settings interface
├── popup.css                  # Popup styling
├── popup.js                   # Popup logic - saves/loads settings
├── README.md                  # This file
├── icons/                     # Extension icons
│   ├── icon16.png            # 16x16 toolbar icon
│   ├── icon48.png            # 48x48 extension management icon
│   └── icon128.png           # 128x128 Chrome Web Store icon
├── docs/                      # Documentation
│   ├── QUICK-START.txt       # Quick start guide
│   └── INSTALL-INSTRUCTIONS.txt  # Installation instructions
└── tests/                     # Testing & Debugging Tools
    ├── test-gemini.html      # Gemini API testing page
    ├── diagnostic.html       # Diagnostic tools
    ├── debug-page.html       # Debug utilities
    ├── fix-settings.html     # Settings repair tool
    ├── generate-icons.html   # Icon generator utility
    ├── TROUBLESHOOTING-GEMINI.md # Gemini-specific troubleshooting
    ├── VALID-MODELS.txt      # List of valid AI models
    ├── DEBUG-STEPS.txt       # Debugging guide
    ├── EXACT-STEPS.txt       # Detailed usage steps
    └── SIMPLE-TEST.txt       # Simple testing guide
```

## 🔄 Updates & Maintenance

### Updating the Extension
1. Download or pull the latest version from the repository
2. Navigate to `chrome://extensions/`
3. Click the refresh/reload icon on the AI Text Polisher extension card
4. Your settings and API keys will be preserved

### Development
- Built with Manifest V3 (latest Chrome extension standard)
- Uses Chrome Storage API for settings persistence
- Background service worker for API communication
- Content scripts with MutationObserver for dynamic content support

## 📚 Additional Resources

- **Quick Start**: See [docs/QUICK-START.txt](docs/QUICK-START.txt)
- **Installation Help**: See [docs/INSTALL-INSTRUCTIONS.txt](docs/INSTALL-INSTRUCTIONS.txt)
- **Testing**: Use [tests/SIMPLE-TEST.txt](tests/SIMPLE-TEST.txt) for quick testing
- **Debugging**: Tools available in [tests/diagnostic.html](tests/diagnostic.html) and [tests/debug-page.html](tests/debug-page.html)
- **Icon Generation**: Use [tests/generate-icons.html](tests/generate-icons.html) to create custom icons

## 🔒 Privacy & Security

- **Local Storage**: API keys and settings are stored locally using Chrome's secure sync storage
- **Direct Communication**: Your text is sent directly to your chosen AI provider's API
- **No Third-Party Servers**: This extension doesn't use any intermediary servers
- **No Data Collection**: No analytics, tracking, or data collection of any kind
- **Open Source**: All code is transparent and reviewable
- **You Control Everything**: Full control over your data, API usage, and costs

## 📄 License

Free to use and modify for personal and commercial projects.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit pull requests.

## 🙏 Acknowledgments

- Built with modern Chrome Extension Manifest V3
- Powered by leading AI providers: OpenAI, Anthropic, and Google
- Created to help writers, content creators, and professionals write better content with the power of AI

---

**Enjoy writing better content! ✨**

*Questions or issues? Check the troubleshooting guides or create an issue in the repository.*
