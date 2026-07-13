# Release Notes — v3.0.0

**Release date:** July 13, 2026
**Package:** `claude-ai-rtl-transformer-v3.0.0.zip` (36 KB)

---

## ⚠️ Read this first if you are upgrading from 2.x

This version needs permission to run on claude.ai automatically — that is what lets the panel be
there without clicking anything. Chrome **always disables an extension that widens its
permissions** until you re-approve it.

So after the update you will likely find the extension greyed out with a "needs your permission
to run" note. **Nothing is broken.** Open the puzzle-piece menu in the toolbar and re-enable it.

---

## What's new

### A floating AUTO / RTL / LTR panel

A small draggable pill sits at the top of every Claude AI page. Drag it by the `⠿` grip; it
remembers where you put it and which mode you chose, across reloads.

| Mode | Behaviour |
| --- | --- |
| **AUTO** (new default) | Every message paragraph picks its own direction from its first strong character, then locks it. Hebrew and Arabic read RTL, English and code read LTR, and a streaming answer never flips mid-render. The sidebar stays LTR. |
| **RTL** | Forces the whole page right-to-left; the sidebar moves to the right edge. Code stays LTR. |
| **LTR** | Off. Claude's stock layout. |

For a mixed Hebrew/English conversation, AUTO means you stop toggling anything at all.

### It runs by itself

No more clicking the icon after every page load. The extension loads on claude.ai automatically
and keeps up with new messages, code blocks and chats as they stream in.

### Per-block chips, redesigned

The old RTL/LTR buttons took up a line of layout above each block. They are now small chips that
float in the corner of the block and fade in when you hover it — styled to match the panel, and
positioned to stay clear of Claude's own copy and send buttons.

### Other sites still work

Clicking the icon anywhere outside claude.ai flips that page between RTL and LTR, one flip per
click — the extension's original behaviour, kept. A second click restores the page's original
direction instead of assuming it was LTR.

---

## Fixed

- **Emoji and CJK were detected as right-to-left.** The direction-detection regex had a Unicode
  range silently corrupted by text normalization, so an answer opening with `✅` or `🎉` — very
  common — was classified as RTL and flipped. Fixed.
- **The composer chip lied in AUTO mode**, showing "RTL" while the field was actually set to
  automatic. Chips now report what the block is really doing.
- **Reloading the extension left dead UI behind**: the panel and chips stayed on screen looking
  perfectly normal, but nothing was clickable. Fixed.

---

## Package contents

```
claude-ai-rtl-transformer-v3.0.0.zip
├── manifest.json          # Extension configuration (MV3)
├── rtl.js                 # Content script: panel, modes, chips, observer
├── rtl.css                # Panel + chip styling, direction cascade
├── background.js          # Service worker: routes the toolbar click
├── icon16.png             # Extension icon 16x16
├── icon48.png             # Extension icon 48x48
├── icon128.png            # Extension icon 128x128
└── LICENSE                # Apache License 2.0
```

## Manual installation

1. Download `claude-ai-rtl-transformer-v3.0.0.zip` and unzip it.
2. Open `chrome://extensions/` (or `edge://extensions/`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and pick the unzipped folder.

## Permissions

- **`host_permissions` — claude.ai only.** Lets the panel appear without a click. The extension
  has standing access to claude.ai and to no other site.
- **`activeTab`.** Powers the plain RTL flip on other sites. It grants access to a page only for
  the click you just made, which is why the extension works everywhere without asking for
  permission on every site you visit.
- **`scripting`.** Reaches claude.ai tabs that were already open when the extension was installed
  or updated, so you don't have to reload them by hand.

Nothing is read, collected, or sent anywhere. The only things stored are your chosen mode and the
panel's position, in your own browser.
