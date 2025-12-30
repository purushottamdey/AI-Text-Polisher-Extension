# 🔧 Troubleshooting Guide - Gemini Not Working

If the "Polish Text" button with Gemini isn't working, follow these steps:

## Step 1: Test Your API Connection

1. Open `test-gemini.html` in your browser
2. Enter your Gemini API key
3. Click "Test Gemini API"
4. If this works, your API key is valid ✅
5. If this fails, check the error message

## Step 2: Check Extension Console Logs

1. Go to `chrome://extensions/`
2. Find "AI Text Polisher" extension
3. Click "Service Worker" or "Inspect views" link
4. This opens the Developer Console for the extension
5. Try using the extension again and check for errors in the console

## Step 3: Verify Settings Are Saved

1. Click the extension icon
2. Make sure:
   - "Google Gemini" is selected in the AI Provider dropdown
   - Your API key is entered
   - Model name is `gemini-1.5-flash` or `gemini-1.5-pro` (or leave blank for default)
3. Click "Save Settings" again
4. You should see "Settings saved successfully!"

## Step 4: Reload the Extension

1. Go to `chrome://extensions/`
2. Toggle the extension OFF then ON
3. Or click the refresh/reload icon
4. Try selecting text again on a webpage

## Step 5: Check for Common Errors

### Error: "API key not configured"
**Solution:** Click the extension icon and save your API key again

### Error: "API_KEY_INVALID" or 403 Forbidden
**Solution:** 
- Your API key is incorrect or expired
- Get a new one from https://aistudio.google.com/app/apikey
- Make sure you copied the entire key

### Error: "Model not found" or 404
**Solution:**
- In settings, try changing the model to: `gemini-1.5-flash-latest`
- Or use: `gemini-1.5-pro-latest`
- Or leave the model field blank to use the default
- Don't add "models/" prefix - just use the model name

### Error: "Quota exceeded" or 429
**Solution:**
- You've hit the rate limit (15 requests/min for Flash, 2 requests/min for Pro)
- Wait a minute and try again
- Or upgrade to paid tier at https://ai.google.dev/pricing

### Button appears but nothing happens
**Solution:**
1. Open browser console (F12)
2. Go to the "Console" tab
3. Try clicking the button again
4. Look for error messages
5. Check the extension's Service Worker console (Step 2 above)

## Step 6: Test with Debug Mode

1. Open a webpage (any site)
2. Select some text
3. Click the "✨ Polish Text" button
4. Right-click on the page → "Inspect" (or press F12)
5. Go to the "Console" tab
6. You should see logs like:
   ```
   Received polishText request: {action: "polishText", text: "..."}
   Starting polishText with: ...
   Loaded settings: {aiProvider: "gemini", hasApiKey: true, modelName: "..."}
   Using provider: gemini
   Calling Gemini API: {model: "gemini-1.5-flash", url: "..."}
   Gemini API response: {...}
   Successfully polished text
   ```

If you don't see these logs, the extension isn't running properly.

## Step 7: Reinstall the Extension

If nothing works:

1. Go to `chrome://extensions/`
2. Remove the "AI Text Polisher" extension
3. Close and reopen Chrome
4. Load the extension again:
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the ChromeAdon folder
5. Configure settings again
6. Test on a webpage

## Still Not Working?

### Check Your Setup:

✅ Extension is enabled in `chrome://extensions/`
✅ Developer mode is ON
✅ You've reloaded the extension after making changes
✅ You've saved your Gemini API key in settings
✅ "Google Gemini" is selected as the AI provider
✅ You're selecting actual text (not images or buttons)
✅ You're testing on a regular webpage (not chrome:// pages)

### Get More Help:

1. **Test API directly**: Open `test-gemini.html` to verify your API key works
2. **Check console**: Look for JavaScript errors in both:
   - Page console (F12)
   - Extension Service Worker console
3. **Try another provider**: Test with OpenAI to see if the extension works at all
4. **Browser version**: Make sure you're using Chrome 88+ or Edge 88+

### Common Working Configuration:

- **AI Provider**: Google Gemini
- **API Key**: (from https://aistudio.google.com/app/apikey)
- **Model Name**: gemini-1.5-flash-latest (or leave blank)
- **Custom Prompt**: (leave blank or add custom instructions)

**Important:** Don't include "models/" prefix in model name!

## Quick Reset:

If you want to start fresh:

1. Go to `chrome://extensions/`
2. Remove the extension
3. Re-add it using "Load unpacked"
4. Click the extension icon
5. Configure:
   - Select "Google Gemini"
   - Paste API key from https://aistudio.google.com/app/apikey
   - Leave model name blank (or use: gemini-1.5-flash-latest)
   - Click Save
6. Go to any webpage
7. Select text
8. Click "✨ Polish Text"

---

**Need to verify your setup is correct?**
1. Open `test-gemini.html` in your browser
2. Enter your API key
3. Test the connection
4. If it works there, it should work in the extension!
