# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Chrome extension (Manifest V3) giving RTL/LTR direction control to Claude AI (claude.ai), for
people reading and writing Hebrew or Arabic in a mostly-LTR interface.

The user-facing surface is a floating **AUTO / RTL / LTR** panel pinned to the top of the page,
plus small per-block override chips on code blocks, the composer, and preview cards.

**Constraints**: Manifest V3, works on both Chrome and Edge, targets claude.ai only.

## Architecture

**Core files**:

| File | Role |
| --- | --- |
| `manifest.json` | MV3 config. Declares the content script + `host_permissions` on claude.ai. |
| `rtl.js` | **Everything.** Content script: the panel, the three modes, the chips, the observer. |
| `rtl.css` | Panel + chip styling, and the direction cascade keyed off body attributes. |
| `background.js` | ~30 line service worker. Its only job is routing the toolbar click. |

**Lineage**: `rtl.js` is a backport of `src/rtl-support.js` from the sibling project
`claude-desktop-windows-rtl` (an Electron patcher), which was itself adapted from this
extension's old `background.js`. If you are changing direction logic, check whether the same
change belongs there too — the two files are deliberately kept diff-able.

### The three modes

`applyMode(m)` is the single entry point. It writes two body attributes, which are what `rtl.css`
keys off:

- `body[data-claude-rtl-mode="auto"|"rtl"|"ltr"]` — always set.
- `body[data-claude-rtl="true"]` + `body.style.direction = 'rtl'` — **only** in RTL mode.

Switching modes always calls `fullClear()` first, so every mode is reversible without a reload.

- **AUTO** (default) — `decide()` reads each block's first strong character and pins `dir` on it,
  then sets `__ccrLocked` so a streaming answer can never flip a paragraph mid-render. Marked
  with `data-ccr` so `clearAutoMarks()` can undo it.
- **RTL** — the blanket cascade: sidebar moves right, messages go RTL, code stays LTR.
- **LTR** — off. The observer early-returns entirely.

### Two things that will bite you

**1. The direction regexes must be written as `\uXXXX` escapes, never literal characters.**
`RE_RTL` covers `יִ-﷽`. Typed as a literal, U+FB1D (HEBREW LETTER YOD WITH HIRIQ)
decomposes under NFD into yod + hiriq — which silently widens the range to `ִ-﷽` and
swallows CJK, Thai, and the high surrogate of every emoji. A reply opening with `✅` then reads
as RTL. That bug is live in the project this was ported from. Don't reintroduce it.

**2. Reloading the extension orphans the DOM (`reclaimStaleDom()`).**
A content script lives in an isolated world. Reloading the extension destroys that world but
leaves the panel and chips in the page — looking perfect, with every listener dead. Worse, the
fresh injection sees them and *skips*: `ensurePanel()` early-returns on `#claude-rtl-panel`
existing, so its button refs stay `null`. Every node we create is tagged `__ccrWorld = WORLD`
(expandos are per-world, so a previous world's nodes read back `undefined`), and
`reclaimStaleDom()` removes anything that isn't ours before `start()` rebuilds it. This does not
exist in the Electron project — it is MV3-specific.

### Chip anchoring (verified against the live DOM)

Claude nests a code block like this:

```
div.relative.group/copy        <- the frame: 31px header strip + the code
  div.overflow-x-auto          <- the horizontal scroll container
    pre.code-block__code       <- the code
```

The chip hangs off **the frame**, found by `codeBlockHost()` climbing out of any scrolling
ancestor. Anchored to either inner element it would sit inside the scroll container and slide
out of view the moment a long line is scrolled sideways.

Corner choice is not arbitrary: Claude's copy button is `position: sticky; top: 8px`, so it
**travels the entire right edge** of the frame as the page scrolls — neither the top-right nor
the bottom-right is ever safe. Its column ends 41px from the frame's right edge, so the chip sits
at `right: 48px; top: 5px`, inside the header strip and clear of it. The composer chip sits at
`top: -22px` (above the fieldset) because the fieldset's whole bottom row is Claude's own
controls — attach, model, settings, mic, voice.

If Claude's layout shifts, `document.body.dataset.claudeRtlChip = 'alt'` flips both chips to the
opposite corner without a code change.

### Per-block override beats the blanket rule

The chip writes `data-claude-dir="rtl"` on the element, not just an inline style — an inline
style loses to an `!important` author rule (this was the 2.1.0 bug). The CSS pairs a blanket rule
at specificity (0,2,1) with an override at (0,3,1); both `!important`, so the more specific one
wins.

### Toolbar click → two different behaviours

`background.js` decides what a click means by probing, not by guessing:

1. `sendMessage(CLAUDE_RTL_CYCLE)`. A claude.ai tab with `rtl.js` loaded answers → modes cycle,
   done. A content script's globals live in an isolated world, so the worker cannot call
   `window.claudeRTLToggle()` directly; the message is the only bridge.
2. Rejected ("Could not establish connection") → no content script here. If `tab.url` is
   claude.ai (populated because we hold host permissions for it), the tab predates the
   install/update: inject `rtl.js` + `rtl.css` and retry.
3. Otherwise it's another site → inject `toggleSimpleDirection`, a plain whole-page RTL/LTR flip.
   It stashes the page's original `dir` in `data-simple-rtl-prev` so a second click restores it
   instead of assuming LTR.

Step 3 runs under **`activeTab`**, which grants access to a tab only for the click that just
happened. That is the whole reason the extension can work on every site without requesting
standing host permission for every site — which would put "read and change your data on all
websites" on the install prompt.

**Every await must stay wrapped in a catch**: an unhandled rejection in a service worker puts a
red "Errors" badge on the extension card. Clicking the icon on `chrome://`, the Web Store, or the
PDF viewer will fail — that is expected, and must fail silently.

`onInstalled` pre-injects into already-open claude.ai tabs, since content scripts are not applied
retroactively.

## Development

**No build system.** Pure JS, no compilation.

**Testing**:
1. `chrome://extensions/` → Developer mode → Load unpacked → select this directory.
2. Open https://claude.ai. The panel should appear **without clicking anything**.
3. After editing any file, hit the refresh icon on the extension card — then **reload the
   claude.ai tab too**, or you are testing the stale-world path (which is worth testing, but on
   purpose).

**Scenarios worth re-running after a change**:
1. **AUTO doesn't flicker**: ask for a long Hebrew answer; no paragraph flips mid-stream.
2. **The emoji test**: ask for an answer opening with `✅`. It must stay LTR. This is the
   regression test for the corrupted regex.
3. **Code chip doesn't scroll away**: scroll a long code line sideways; the chip must not move.
4. **Chips clear Claude's controls**: the code chip must not cover the copy button at any scroll
   position; the composer chip must not cover send/mic/model.
5. **Modes are reversible**: AUTO → RTL → LTR → AUTO leaves no `[data-ccr]` or
   `[data-claude-rtl-processed]` behind.
6. **Stale world**: reload the extension with claude.ai open, then click the icon. Everything must
   still be clickable.
7. **Other sites**: click the icon on any normal site — the page flips to RTL; click again and it
   returns to exactly the direction it started in (not "ltr").
8. **Unreachable pages**: click the icon on `chrome://extensions` or the Web Store. Nothing
   happens, and no red error badge appears on the extension card.

**Packaging**:
1. ZIP: `manifest.json`, `rtl.js`, `rtl.css`, `background.js`, `icon16.png`, `icon48.png`, `icon128.png`
2. Exclude: `.git`, `.a5c`, docs, `LICENSE`, previous zips
3. Submit to Chrome Web Store and Microsoft Edge Add-ons

**⚠️ Store note**: v3.0.0 widened permissions from `activeTab` to `host_permissions` on claude.ai.
That triggers a fresh review, adds "Read and change your data on claude.ai" to the install prompt,
and — most importantly — **disables the extension for existing users until they re-approve it**.
Say so in the release notes; otherwise it reads as "the extension broke."

## Permissions

- `host_permissions` (`https://claude.ai/*`, `https://*.claude.ai/*`): required for the declarative
  content script, i.e. for the panel to be there without a click.
- `activeTab`: the plain RTL flip on non-claude sites. Deliberately not a broad host permission —
  `activeTab` grants a page only for the click the user just made, so the install prompt stays
  free of "read and change your data on all websites".
- `scripting`: to reach claude.ai tabs already open at install/update time, and to run the plain
  flip under the `activeTab` grant.
