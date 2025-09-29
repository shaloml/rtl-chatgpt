# Changelog

All notable changes to Claude AI RTL Transformer will be documented in this file.

## [2.0.0] - 2025-09-29

### 🎉 Major Release - Complete Rewrite for Claude AI

#### Added
- **Smart Toggle Buttons**: Individual RTL/LTR buttons for code blocks and conversation inputs
- **Code Block Detection**: Automatically detects `.code-block__code` elements
- **Conversation Input Detection**: Automatically detects `fieldset.flex.w-full.min-w-0.flex-col` elements
- **Dynamic Content Handling**: MutationObserver watches for new elements in real-time
- **Child Element Support**: RTL/LTR applied to all child elements in conversation inputs
- **Text Alignment Fix**: Automatic `text-align` adjustment when switching directions
- **Global Toggle**: Click extension icon multiple times to toggle entire page direction
- **Non-Overlapping Buttons**: Toggle buttons positioned on left side (Copy button stays on right)
- **Debounced Processing**: 100ms delay to optimize performance
- **Default Directions**: LTR for code blocks, RTL for conversation inputs

#### Changed
- **Target Platform**: Now specifically optimized for Claude AI (chat.claude.ai)
- **Extension Name**: Changed from "ChatGPT RTL Transformer" to "Claude AI RTL Transformer"
- **Architecture**: Completely rewritten injection logic
- **Manifest Version**: Updated to v3 with proper host_permissions
- **Button Styling**: Semi-transparent dark buttons with hover effects

#### Removed
- **Legacy Support**: Removed old ChatGPT-specific code
- **content.js**: Deprecated in favor of service worker injection

#### Fixed
- Text alignment issues when switching to RTL
- Button overlap with native Copy buttons
- Multiple initialization prevention
- Direction not applying to nested elements

---

## [1.0.0] - 2023-04-22

### Initial Release
- Basic LTR/RTL toggle for web pages
- Support for `.overflow-y-auto` elements
- Simple body direction switching