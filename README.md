# Claude AI RTL Transformer

A Chrome/Edge browser extension that provides advanced RTL/LTR text direction control specifically optimized for Claude AI (chat.claude.ai). This extension is essential for users who work with RTL languages such as Hebrew or Arabic on the Claude AI platform.

## Features

### Smart Toggle Buttons
- **Code Blocks**: Automatically detects code blocks and adds individual RTL/LTR toggle buttons
  - Default direction: **LTR** (optimal for code)
  - Button positioned on the left side (doesn't interfere with Copy button)

- **Conversation Input**: Adds toggle buttons to chat input fields
  - Default direction: **RTL** (optimal for Hebrew/Arabic text)
  - Applied to all child elements for consistent formatting

### Global Direction Control
- **First Click**: Initializes the extension and sets the page to RTL
- **Subsequent Clicks**: Toggles the entire page between RTL and LTR

### Dynamic Content Support
- Automatically detects and processes new code blocks as they appear
- Handles dynamically loaded conversation elements
- No need to refresh or re-activate after sending messages

### Text Alignment Fix
- Automatically adjusts `text-align` property when switching directions
- Ensures proper text display in both RTL and LTR modes

## Installation

### From Chrome Web Store / Microsoft Edge Add-ons
1. Visit the extension page on the [Chrome Web Store](#) or [Microsoft Edge Add-ons](#)
2. Click "Add to Chrome" or "Get" (for Edge)
3. Confirm the installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/` or `edge://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension directory

## Usage

1. Navigate to [claude.ai](https://claude.ai) and start a conversation
2. Click the extension icon in your browser toolbar
3. The page will switch to RTL direction
4. You'll see toggle buttons appear on:
   - Code blocks (showing "LTR")
   - Chat input field (showing "RTL")
5. Click any toggle button to switch that element's direction
6. Click the extension icon again to toggle the entire page direction

### Example Workflow
```
1. Open Claude AI conversation
2. Click extension icon → Page switches to RTL
3. Type in Hebrew/Arabic → Input is in RTL
4. Claude responds with code → Code blocks are in LTR
5. Click code block toggle → Switch specific code to RTL if needed
6. Click extension icon again → Page switches to LTR
```

## Permissions

The extension requires the following permissions:

- `activeTab`: Access the currently active tab when you click the extension icon
- `scripting`: Execute scripts to inject RTL/LTR functionality
- `host_permissions` (https://claude.ai/*): Specifically allows the extension to work on Claude AI pages (required for Manifest V3 compliance)

## Technical Details

### Architecture
- **Manifest Version**: 3 (latest Chrome extension standard)
- **Injection Method**: Service worker with script injection
- **Dynamic Detection**: MutationObserver for real-time element tracking
- **Performance**: Debounced processing (100ms) to minimize overhead

### Compatibility
- ✅ Google Chrome (latest)
- ✅ Microsoft Edge (latest)
- ✅ Chromium-based browsers
- 🎯 Optimized specifically for https://claude.ai

### Files Structure
```
├── manifest.json          # Extension configuration
├── background.js          # Main logic and script injection
├── icon16.png            # Extension icon (16x16)
├── icon48.png            # Extension icon (48x48)
├── icon128.png           # Extension icon (128x128)
├── README.md             # This file
└── CLAUDE.md             # Developer documentation
```

## Troubleshooting

**Toggle buttons not appearing?**
- Make sure you're on a claude.ai page
- Click the extension icon to initialize
- Refresh the page if needed

**Buttons overlapping?**
- RTL/LTR buttons are positioned on the LEFT
- Copy buttons remain on the RIGHT
- If issues persist, try disabling other extensions

**Direction not applying to input?**
- The extension applies direction to all child elements
- Clear your browser cache if issues persist

## Development

See [CLAUDE.md](CLAUDE.md) for detailed development documentation, including:
- Code architecture
- Testing procedures
- Packaging instructions
- Contributing guidelines

## Support

If you have any questions or need assistance, please contact the extension's support team through [shaloml@gmail.com](mailto:shaloml@gmail.com).

## License

This extension is released under the [Apache License 2.0](LICENSE).

---

**Made with ❤️ for the Hebrew and Arabic speaking Claude AI community**
