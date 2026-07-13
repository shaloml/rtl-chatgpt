# Claude AI RTL Transformer

A Chrome/Edge browser extension that provides advanced RTL/LTR text direction control specifically optimized for Claude AI (claude.ai). This extension is essential for users who work with RTL languages such as Hebrew or Arabic on the Claude AI platform.

## Features

### Floating control panel
A small draggable **AUTO / RTL / LTR** panel is pinned to the top of every Claude AI page.
Drag it by the `⠿` grip; it remembers where you put it, and which mode you chose.

| Mode | What it does |
| --- | --- |
| **AUTO** (default) | Each message paragraph picks its own direction from its first strong character, then locks it — Hebrew and Arabic read RTL, English and code read LTR, and streaming answers never flip mid-render. The sidebar and UI chrome stay LTR. |
| **RTL** | Forces the whole page right-to-left. The sidebar moves to the right edge. Code blocks still read LTR. |
| **LTR** | Off. Claude's stock layout. |

The toolbar icon cycles the modes (AUTO → RTL → LTR), same as clicking the panel.

### Per-block override chips
AUTO gets it right almost always — but when it doesn't, every code block, the chat input, and
preview cards carry their own small chip in the corner. It fades in when you hover the block
and flips just that block. Chips never move the layout, and they stay clear of Claude's own
controls (the copy button, the send button).

Code blocks default to LTR; a chip turns blue when you've forced a block to RTL.

### Runs by itself
No clicking to activate. The extension loads on every claude.ai page, remembers your mode
across reloads, and picks up new messages, code blocks and chats as they appear.

### Works on other sites too
Click the icon on any other page and it flips the whole page between RTL and LTR, one flip per
click — the extension's original behaviour, kept. A second click puts the page back the way it
was. No panel, no chips, no memory: just the flip. The extension only touches a page when you
click the icon on it.

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

**On claude.ai** — open it. The panel is already there; that's the whole setup. AUTO is the
default and handles a mixed Hebrew/English conversation on its own: you type Hebrew and it reads
right-to-left, Claude answers with code and it reads left-to-right. Reach for the chips only for
the odd block AUTO gets wrong, and for RTL mode when you want the entire interface (sidebar
included) mirrored. The toolbar icon cycles the modes.

**On any other site** — click the toolbar icon to flip the page to RTL. Click again to put it
back.

## Permissions

- `host_permissions` (`https://claude.ai/*`): lets the extension run on Claude AI pages
  automatically. This is what powers the always-there panel; without it you would be back to
  clicking the icon on every page load.
- `activeTab`: powers the plain RTL flip on other sites. It grants access to a page **only for
  the click you just made** — which is why the extension can work everywhere without asking for
  standing permission on every site you visit.
- `scripting`: used to reach claude.ai tabs that were already open when the extension was
  installed or updated, so you don't have to reload them by hand.

Nothing is read, stored, or sent anywhere. The only thing saved is your chosen mode and the
panel's position, in your browser's local storage.

> **Upgrading from 2.x?** Chrome disables an extension that widens its permissions until you
> re-approve it. Re-enable it from the puzzle-piece menu after the update.

## Technical Details

### Architecture
- **Manifest Version**: 3
- **Injection**: a declarative `content_scripts` entry (`rtl.js` + `rtl.css`). The service
  worker is a ~30 line router whose only job is turning a toolbar click into a message —
  a content script lives in an isolated world the worker cannot call into directly.
- **Direction detection**: first-strong-character per paragraph, locked once so streaming
  cannot flip a paragraph mid-render.
- **Dynamic content**: MutationObserver batched per animation frame.
- **State**: `localStorage` on the claude.ai origin (`claude-rtl-mode`, `claude-rtl-panel-*`).

### Compatibility
- ✅ Google Chrome (latest)
- ✅ Microsoft Edge (latest)
- ✅ Chromium-based browsers
- 🎯 Optimized specifically for https://claude.ai

### Files Structure
```
├── manifest.json          # Extension configuration
├── rtl.js                 # Content script: panel, modes, chips, observer
├── rtl.css                # Panel + chip styling, direction cascade
├── background.js          # Service worker: routes the toolbar click
├── icon16.png            # Extension icon (16x16)
├── icon48.png            # Extension icon (48x48)
├── icon128.png           # Extension icon (128x128)
├── README.md             # This file
└── CLAUDE.md             # Developer documentation
```

## Troubleshooting

**No panel?**
- Make sure you're on a claude.ai page.
- If you just installed or updated the extension, reload the tab.
- Check that Chrome hasn't disabled the extension pending permission re-approval.

**Panel is visible but nothing is clickable?**
- This happens if the extension was reloaded while the tab stayed open. Reload the page.

**A paragraph came out in the wrong direction?**
- That's AUTO reading the paragraph's first strong character. Use the block's chip to
  override it, or switch to RTL/LTR mode for a blanket answer.

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
