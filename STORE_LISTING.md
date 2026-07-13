# Store Listing Information

This document contains all the information needed to submit the extension to Chrome Web Store and Microsoft Edge Add-ons.

---

## Extension Name
**Claude AI RTL Transformer**

---

## Short Description (132 characters max)
Toggle RTL/LTR directions in Claude AI. Adds smart buttons to code blocks & chat inputs for Hebrew & Arabic speakers.

---

## Detailed Description

### Overview
Claude AI RTL Transformer is an essential browser extension for Hebrew and Arabic speakers who use Claude AI (chat.claude.ai). It provides seamless RTL (Right-to-Left) and LTR (Left-to-Right) text direction control with smart, context-aware toggle buttons.

### Key Features

**🎯 Smart Toggle Buttons**
- Automatically detects code blocks and adds individual toggle buttons
- Code blocks default to LTR for optimal readability
- Conversation inputs default to RTL for Hebrew/Arabic text
- Buttons positioned on the left side (no interference with Copy button)

**🔄 Global Direction Control**
- First click: Initialize extension and set page to RTL
- Subsequent clicks: Toggle entire page between RTL and LTR
- Persistent direction across page interactions

**⚡ Dynamic Content Support**
- Automatically processes new code blocks as they appear
- Handles dynamically loaded conversation elements
- No need to refresh after sending messages

**✨ Perfect Text Alignment**
- Automatically adjusts text-align property
- Applies direction to all child elements
- Ensures consistent formatting throughout

### Perfect For
- Hebrew speakers working with Claude AI
- Arabic speakers working with Claude AI
- Developers mixing RTL text with code
- Anyone needing flexible text direction control

### How It Works
1. Visit Claude AI and start a conversation
2. Click the extension icon to initialize
3. See toggle buttons appear on code blocks and input fields
4. Click any button to switch that element's direction
5. Click extension icon again to toggle page direction

### Technical Highlights
- Manifest V3 compliant
- Lightweight and fast (< 30KB)
- No external dependencies
- Privacy-focused (no data collection)
- Works on Chrome and Edge browsers

### Permissions

Paste these as the justifications in the submission form:

- **host_permissions (`https://claude.ai/*`)** — The extension rewrites text-direction styles in
  the claude.ai DOM so Hebrew and Arabic read correctly. It needs to run on page load, without a
  click, for the direction control panel to be present. It runs on claude.ai and nowhere else. No
  data is read, stored, or transmitted off-device.
- **activeTab** — Powers a plain whole-page RTL/LTR flip on any other site, applied only to the
  tab the user just clicked the icon on. Chosen deliberately over a broad host permission so the
  extension never asks for standing access to every site.
- **scripting** — Used to re-inject the content script into claude.ai tabs that were already open
  when the extension was installed or updated, so the user does not have to reload them, and to
  run the plain flip under the activeTab grant.

**Data use:** no remote code, no collection, no analytics. Only the user's chosen mode and the
panel's position are stored, in their own browser's local storage.

> ⚠️ **v3.0.0 widens permissions** (activeTab → activeTab + host_permissions on claude.ai). This
> triggers a fresh review, adds "Read and change your data on claude.ai" to the install prompt,
> and **disables the extension for existing users until they re-approve it**. Say so in the
> "What's new" field, or users will read it as the extension breaking.

---

## Category
**Accessibility** or **Productivity**

---

## Language
English (Primary)

---

## Screenshots Descriptions

### Screenshot 1: Code Block with Toggle
"RTL/LTR toggle button automatically added to code blocks (default: LTR)"

### Screenshot 2: Conversation Input with Toggle
"Smart toggle button for conversation input fields (default: RTL)"

### Screenshot 3: Mixed Hebrew and Code
"Seamlessly work with Hebrew text and code blocks in the same conversation"

### Screenshot 4: Button Positioning
"Toggle buttons on the left, Copy buttons on the right - no overlap"

### Screenshot 5: Global Toggle
"Click extension icon to toggle entire page direction"

---

## Keywords/Tags
- RTL
- LTR
- Hebrew
- Arabic
- Claude AI
- Text Direction
- Right-to-Left
- Accessibility
- Bi-directional
- Code blocks
- Chat
- AI Assistant

---

## Privacy Policy Summary
This extension does not collect, store, or transmit any user data. It operates entirely locally within your browser and only modifies the visual presentation of the Claude AI interface.

---

## Version
2.0.0

---

## Pricing
Free

---

## Support Email
shaloml@gmail.com

---

## Website (Optional)
https://github.com/[your-username]/rtl-chatgpt

---

## Video/Demo Link (Optional)
[To be added - consider creating a short demo video]

---

## Age Rating
Everyone

---

## Content Rating
No objectionable content