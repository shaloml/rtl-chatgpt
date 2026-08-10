# Store submission — v3.0.1 (Chrome Web Store + Edge Add-ons)

Patch release: no new permissions, no new data collection, no listing changes.
The v3.0.0 privacy-tab answers (STORE_SUBMISSION_v3.0.0.md) remain valid as-is —
do NOT touch the permissions/privacy tabs, so the review stays shallow.

Upload: `claude-ai-rtl-transformer-v3.0.1.zip` (7 files: manifest, rtl.js,
rtl.css, background.js, 3 icons).

## Release notes (public — use wherever the store shows "what's new"; Edge has a
## dedicated field, Chrome only shows the version, so this text also fits the
## top of the listing description if you keep a changelog section there)

**v3.0.1 — RTL mode fixed against Claude's new per-paragraph direction logic**

Claude.ai recently started deciding each paragraph's direction from its first
character. That silently broke forced-RTL: a Hebrew paragraph that merely
opened with an English word (React, Docker...) snapped back to left-to-right.

- RTL mode now truly forces RTL across messages — including paragraphs,
  headings, lists and tables that open with a Latin word.
- AUTO mode's per-paragraph lock works again (no more mid-answer flipping
  while a reply streams in).
- Bullets and numbers of Hebrew list items are no longer cut off in AUTO mode.
- Code blocks and inline code always stay left-to-right, in every mode.
- New: stray "\u200F"-style escape text that the model sometimes prints into
  answers is now hidden from display (code blocks and the message box are
  never touched).

No new permissions. No data is collected — everything runs locally in your
browser.

## Notes for certification (Edge reviewer notes / Chrome if asked)

This is a CSS/JS-only patch release of the existing extension. claude.ai
changed its own stylesheet to resolve text direction per paragraph
(unicode-bidi:plaintext utility classes), which broke this extension's forced
RTL mode for mixed Hebrew/English text. v3.0.1 adjusts the injected CSS to
re-assert the user-chosen direction inside chat messages, and the existing
MutationObserver now also removes literal escape-sequence text (the six ASCII
characters backslash-u-2-0-0-F) from displayed messages. No changes to
permissions, hosts, background logic, or data handling. All processing remains
local; no network requests are made by the extension.

## Hebrew snippet (optional, for social/README)

תוקן: מצב RTL כפוי שוב עובד גם כשפסקה עברית נפתחת במילה באנגלית (שינוי
פנימי ב-claude.ai שבר את זה); ננעל הכיוון בזמן סטרימינג ב-AUTO; סימוני
רשימה בעברית לא נחתכים יותר; וטקסט escape מילולי שהמודל לפעמים מדפיס
מוסתר מהתצוגה. בלי הרשאות חדשות.
