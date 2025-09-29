# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension (Manifest V3) that provides advanced RTL/LTR text direction control for Claude AI. It's specifically designed to improve readability for RTL languages like Hebrew and Arabic on the Claude AI interface (chat.claude.ai).

**Key Features**:
- **Automatic Detection**: Identifies code blocks and conversation input fields in Claude AI
- **Smart Toggle Buttons**: Injects RTL/LTR toggle buttons into:
  - Code blocks (class `code-block__code`) - Default: LTR
  - Conversation input fieldsets - Default: RTL
- **Dynamic Updates**: Uses MutationObserver to handle newly added elements in real-time
- **One-Click Activation**: Click the extension icon to initialize RTL support on any Claude AI page

**Critical Requirements**:
- Must be fully optimized for Claude AI interface (chat.claude.ai)
- Must comply with the latest Chrome extension requirements and Manifest V3 standards
- Must be deployed and functional on both Chrome and Edge browsers

## Architecture

**Extension Type**: Browser action extension using Manifest V3 service worker architecture

**Core Files**:
- `manifest.json` - Extension configuration (Manifest V3) with Claude AI host permissions
- `background.js` - Service worker that injects the `initializeClaudeRTL()` function
- `content.js` - Legacy content script (deprecated, not used in current version)
- Icons: `icon16.png`, `icon48.png`, `icon128.png`

**How it Works**:

1. **Initialization**:
   - User clicks the extension icon on a Claude AI page
   - `background.js` receives the click event via `chrome.action.onClicked`
   - `initializeClaudeRTL()` function is injected using `chrome.scripting.executeScript`
   - Prevents duplicate initialization with `window.claudeRTLInitialized` flag

2. **Global Styles Injection**:
   - Creates a `<style>` element (ID: `claude-rtl-extension-styles`) with:
     - `.claude-rtl-toggle-btn` - Styled toggle button (semi-transparent dark background)
     - `.claude-fieldset-wrapper` - Wrapper for conversation fieldsets
     - Override rules for `.overflow-y-auto` elements when body has `data-claude-rtl="true"`

3. **Element Processing**:
   - **Code Blocks** (`processCodeBlocks()`):
     - Finds all `.code-block__code` elements
     - Sets default direction to `ltr`
     - Injects a toggle button showing "LTR"
     - Button click toggles between LTR/RTL

   - **Conversation Fieldsets** (`processFieldsets()`):
     - Finds all `fieldset.flex.w-full.min-w-0.flex-col` elements
     - Sets default direction to `rtl`
     - Wraps fieldset in `.claude-fieldset-wrapper` div
     - Injects a toggle button showing "RTL"
     - Button click toggles between RTL/LTR

4. **Dynamic Content Handling**:
   - `MutationObserver` watches for DOM changes
   - Automatically processes new code blocks and fieldsets as they're added
   - Debounced processing (100ms delay) to avoid performance issues

5. **Body Direction**:
   - Sets `document.body.style.direction = 'rtl'`
   - Adds `data-claude-rtl="true"` attribute to body
   - Ensures `.overflow-y-auto` elements maintain `ltr` direction for proper layout

**Note**: `content.js` is deprecated legacy code. The current implementation uses script injection from the service worker for better Manifest V3 compliance and performance.

## Development

**No build system**: This is a pure JavaScript Chrome extension with no compilation or build steps required.

**Testing the extension**:
1. Open Chrome or Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this project directory
5. The extension will appear in your toolbar
6. Navigate to https://claude.ai and start or open a conversation
7. Click the extension icon to activate RTL support
8. Observe:
   - Code blocks get LTR toggle buttons (default: LTR)
   - Conversation input fieldset gets RTL toggle button (default: RTL)
   - New messages/code blocks automatically get toggle buttons

**Making changes**:
- After editing `background.js` or `manifest.json`, click the refresh icon on the extension card in `chrome://extensions/`
- For best testing, use Claude AI with Hebrew/Arabic text mixed with code blocks
- Check browser console for any errors using DevTools (F12)

**Key Testing Scenarios**:
1. **Code Block Toggle**: Verify code blocks default to LTR and toggle button appears in top-right
2. **Input Field Toggle**: Verify conversation input defaults to RTL and toggle button appears
3. **Dynamic Content**: Send a message with code, verify new code blocks get toggle buttons
4. **Multiple Clicks**: Click extension icon multiple times - should not duplicate buttons or styles

**Packaging for distribution**:
1. Create a ZIP file containing: `manifest.json`, `background.js`, `icon16.png`, `icon48.png`, `icon128.png`
2. Exclude: `.git`, `.real-pages`, `content.js` (deprecated), `README.md`, `CLAUDE.md`, `LICENSE`
3. Submit to Chrome Web Store and Microsoft Edge Add-ons store

## Permissions

- `activeTab`: Access current tab when user clicks the extension icon
- `scripting`: Execute scripts to inject RTL/LTR functionality
- `host_permissions`: Specifically allows execution on https://claude.ai/* (required for Manifest V3)