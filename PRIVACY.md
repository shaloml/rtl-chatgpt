# Privacy Policy — Claude AI RTL Transformer

**Last updated:** July 13, 2026

## The short version

This extension collects nothing. It has no server, no account, no analytics, and no remote code.
Nothing you type, read, or browse ever leaves your computer.

## What the extension does

Claude AI RTL Transformer changes the *reading direction* of text — right-to-left for Hebrew and
Arabic, left-to-right for English and code. It does this by setting CSS properties (`direction`,
`text-align`, the `dir` attribute) on elements already on the page, and by adding its own small
control buttons to the page.

That is the entire function. It is a presentation-layer tool.

## Data we collect

**None.** Specifically, the extension does not collect, store, or transmit:

- Personally identifiable information
- Health information
- Financial or payment information
- Authentication information
- Personal communications — including the content of your Claude conversations
- Location
- Web history
- User activity (clicks, scrolling, keystrokes)
- Website content

## About reading page text

To decide whether a paragraph should read right-to-left or left-to-right, the extension looks at
that paragraph's first strong-direction character (a Hebrew/Arabic letter, or a Latin letter).

This happens entirely inside your browser, in memory, at the moment the paragraph is displayed.
The text is not copied, not stored, not logged, and not sent anywhere. Nothing is retained after
the check. The extension has no network code of any kind — it cannot transmit data even in
principle.

## What is stored, and where

Three values, in your own browser's `localStorage` on the claude.ai origin:

| Key | Value |
| --- | --- |
| `claude-rtl-mode` | Which mode you chose: `auto`, `rtl`, or `ltr` |
| `claude-rtl-panel-left` | Where you dragged the control panel (X) |
| `claude-rtl-panel-top` | Where you dragged the control panel (Y) |

That is all. These never leave your machine, and you can clear them at any time by clearing the
site's data.

## Permissions, and why each one exists

- **Host permission for `claude.ai`** — so the direction controls are present when you open Claude,
  and so each new message gets the right direction as it streams in. The extension has standing
  access to claude.ai and to no other website.
- **`activeTab`** — for the plain right-to-left flip on other sites. `activeTab` grants access to a
  page *only at the moment you click the extension's icon on it*. The extension cannot see or touch
  any site in the background, and cannot act on a site you never clicked the icon on. This was
  chosen deliberately instead of requesting permission for all websites.
- **`scripting`** — to run the extension's own bundled code, either under the `activeTab` grant
  above, or to reach claude.ai tabs that were already open when the extension was installed or
  updated (Chrome does not apply content scripts to existing tabs retroactively).

## Third parties

There are none. No data is sold, shared, or transferred to anyone, because no data is ever
collected.

## Remote code

The extension executes only the JavaScript and CSS bundled inside its own package. It contains no
`eval()`, no dynamically fetched scripts, and no external resources.

## Source code

The extension is open source under the Apache License 2.0. You can read every line of it:
https://github.com/shaloml/rtl-chatgpt

## Contact

Questions about this policy: shaloml@gmail.com
