# Changelog

All notable changes to Claude AI RTL Transformer will be documented in this file.

## [3.0.1] - 2026-08-10

### Fixed
- **RTL mode: a Hebrew paragraph opening with an English word rendered LTR.** Anthropic's
  chat UI resolves each markdown block's direction from the block's own first strong
  character (`unicode-bidi: plaintext` on prose blocks, `<span dir="auto">` around
  user-message text), which overrides the forced page direction. Diagnosed against
  Claude Code's webview in the sibling project vscode-claude-rtl (v0.2.1); claude.ai
  shares the pattern. RTL mode now re-asserts `direction: rtl` and cancels plaintext
  with `unicode-bidi: isolate` on prose blocks inside messages, and forces app-authored
  `dir="auto"` wrappers. `!important` is required — claude.ai delivers plaintext as
  lazily-loaded Tailwind utility classes (`[unicode-bidi:plaintext]`, some duplicated
  under an `.epitaxy-root` prefix at higher specificity), and those chunks load after
  the content-script CSS, so at equal importance the app wins ties. It cannot leak
  into code: `pre`/`code` now carry a direct LTR rule, and a direct rule beats
  inherited direction outright.
- **AUTO mode: the per-paragraph direction lock could be silently defeated.** The `dir`
  attribute `decide()` pins carries only UA-level styles, which any author-level
  `unicode-bidi` rule from the app overrides — bringing back the mid-stream flipping
  the lock exists to prevent. The locked direction is now also asserted at author level
  via `[data-ccr][dir]` rules.
- **AUTO mode: list markers (numbers/bullets) of RTL-locked items are no longer
  clipped** — the parent list stays LTR with left-only padding, so the right-side
  marker of a Hebrew item was drawn outside it; it now renders inside the item's
  content flow (`list-style-position: inside`).

### Added
- **Strip literal bidi-escape text**: Claude sometimes emits a bidi mark as literal
  escape text — the six ASCII characters backslash, `u`, `2`, `0`, `0`, `F` (or the
  200E / 200B variants) — instead of the invisible character. It renders as garbage
  and, starting with Latin `u`, drags a Hebrew paragraph's first-strong detection to
  LTR. The observer now strips that literal text from rendered prose. Display-only
  (the conversation itself is untouched); code blocks, the composer, and all editable
  surfaces are skipped.

## [3.0.0] - 2026-07-13

### 🎉 Floating AUTO / RTL / LTR panel

> **⚠️ Existing users must re-approve the extension.** This release needs permission to run
> on claude.ai automatically, so Chrome will disable the extension after it updates until
> you re-enable it from the puzzle-piece menu. Nothing is broken — Chrome always asks when
> an extension widens its permissions.

#### Added
- **Floating control panel**: a draggable **AUTO / RTL / LTR** pill pinned to the top of the
  page. Drag it by the `⠿` grip; its position is remembered.
- **AUTO mode (new default)**: each message paragraph gets its direction from its first
  strong character and is then locked, so streaming answers never flip mid-render. Hebrew
  and Arabic go RTL, English and code stay LTR — no manual toggling for a mixed conversation.
- **Runs automatically** on every claude.ai page. No more clicking the icon after every reload.
- **State is remembered** across reloads (`localStorage`: mode + panel position).
- **Works on any other site too**: clicking the icon outside claude.ai flips the whole page
  between RTL and LTR, one flip per click — the extension's original behaviour, kept. It runs
  under `activeTab`, so it only ever touches a page you explicitly clicked the icon on, and it
  adds no permission warning for other sites. A second click restores the page's original
  direction rather than assuming LTR.

#### Changed
- **Per-block toggles are now floating chips** in the corner of the block, styled to match
  the panel. They fade in on hover instead of taking up a line of layout. Code chips sit in
  the block's header strip, clear of Claude's copy button (which is `sticky` and travels the
  whole right edge). Composer chip sits above the input, clear of the send controls.
- **Toolbar icon** now cycles the modes on claude.ai (AUTO → RTL → LTR) instead of
  initializing/toggling. On any other site it keeps the old whole-page flip.
- **Permissions**: added `host_permissions` on claude.ai, needed for automatic injection.
  `activeTab` is kept for the plain toggle on other sites; `scripting` is used to reach
  claude.ai tabs that were already open when the extension was installed or updated.
- **Architecture**: the injected-function-from-service-worker model is replaced by a proper
  `content_scripts` entry (`rtl.js` + `rtl.css`). `background.js` is now a ~30 line router.
- Observer is batched per animation frame and also watches `characterData`, replacing the
  100 ms full-document rescan.

#### Fixed
- **Emoji and CJK detected as RTL**: the direction regex ported from the desktop project had
  a Unicode range silently corrupted by NFC/NFD normalization (`יִ` decomposed into two
  characters, widening the range to `ִ-﷽`). A reply opening with `✅` or `🎉` — very
  common — was classified as RTL. The ranges are now written as explicit escapes.
- **Composer chip claimed "RTL" in AUTO mode** while the field was actually set to `dir=auto`.
  Chips now report the block's real direction.
- **Dead UI after an extension reload**: the panel and chips survived in the DOM while their
  listeners did not, so everything looked fine and nothing was clickable. A stale-DOM sweep
  now reclaims them.

#### Removed
- `content.js` — dead since 2.0.0, never referenced by the manifest.

---

## [2.1.0] - 2026-02-24

### RTL Layout & Toggle Fix

#### Added
- **Sidebar Flip**: Sidebar moves to the right side when RTL is active, matching natural RTL layout
- **Code Block Toggle Override**: `data-claude-dir` attribute system allows toggling code block direction despite default LTR

#### Fixed
- **Code Block Toggle Broken**: Clicking LTR/RTL button on code blocks and markdown blocks changed the label but did not change direction (CSS `!important` was overriding inline styles)

---

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