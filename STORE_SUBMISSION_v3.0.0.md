# Chrome Web Store — Privacy tab answers (v3.0.0)

Paste each block verbatim. Every field below replaces stale v1-era text that described
`.overflow-y-auto` and a plain body toggle — none of which is what the extension does anymore.

---

## Single purpose description

> **Why this matters:** the reviewer will ask whether one extension that touches claude.ai *and*
> every other site can honestly claim a single purpose. It can — the purpose is text direction —
> but the answer has to say so explicitly, or it reads like two extensions in a trenchcoat.

```text
This extension has a single purpose: controlling the reading direction (right-to-left or left-to-right) of text the user is viewing in their browser.

Hebrew and Arabic render left-to-right in Claude AI (claude.ai), which makes them very hard to read. On claude.ai the extension adds a small floating direction-control panel, sets the correct direction on each message paragraph automatically as it arrives, and offers per-block controls for code blocks and the chat input.

On any other website, clicking the toolbar icon flips that one page's direction, and clicking again restores it.

Both behaviours are the same single function - setting CSS text direction on the page the user is looking at. The extension changes visual presentation only. It has no other feature, and it does not read, store, or transmit page content or any user data.
```

---

## activeTab justification

```text
activeTab powers exactly one feature: when the user clicks the extension's toolbar icon on a website other than claude.ai, the extension injects a small bundled function into that single tab which sets the document's text direction to right-to-left, and restores the page's original direction on the next click.

activeTab was chosen deliberately in place of requesting host permissions for all websites. It means the extension can only ever act on a tab in direct response to the user clicking its icon on that tab, and never has standing access to the user's browsing.
```

---

## scripting justification

```text
chrome.scripting is used in two places, both bundled code, never remote code:

1. Under the activeTab grant, to inject the direction-toggle function into the one tab where the user just clicked the extension icon (websites other than claude.ai).

2. To inject the extension's own content script (rtl.js and rtl.css, both included in the package) into claude.ai tabs that were already open at the moment the extension was installed or updated. Chrome does not apply content scripts to already-open tabs retroactively, so without this the user would have to manually reload every open Claude tab after an update.

Only code shipped inside the extension package is ever executed.
```

---

## Host permission justification  ← this field is currently EMPTY, and it is the one that triggers deep review

```text
Requested: https://claude.ai/* and https://*.claude.ai/*

The extension makes Hebrew and Arabic readable in Claude AI. That requires running on claude.ai at page load rather than on a toolbar click, for two reasons:

1. The floating direction-control panel must already be on screen when the page opens. Requiring a click on every page load was the previous version's behaviour, and its biggest complaint.

2. Claude is a single-page app whose answers stream in progressively. Each new paragraph needs its direction set as it arrives. A permission granted only at the moment of a click cannot do this: the content that needs fixing does not exist yet when the click happens.

The permission is scoped to claude.ai and requested for no other site. There, the extension only sets CSS direction and text-align, sets the dir attribute on paragraphs, and inserts its own controls. It does not read, collect, store or transmit page content, conversation text, or any user data, and has no network code.
```

---

## Remote code

**Answer: NO — "לא נעשה שימוש בהרשאה קוד מרוחק"**

Verified: the packaged files contain no `eval()`, no `new Function`, no `import()`, no `fetch`, no
`XMLHttpRequest`, no external `<script>` tags, and no external URLs. The only URLs anywhere in the
package are the `https://claude.ai/*` match patterns in the manifest.

---

## Data collection checkboxes

**Tick nothing.** Not one of the nine categories applies:

| Category | Applies? |
| --- | --- |
| Personally identifiable information | No |
| Health information | No |
| Financial and payment information | No |
| Authentication information | No |
| Personal communications | **No** — see the note below |
| Location | No |
| Web history | No |
| User activity | No |
| Website content | **No** — see the note below |

**The two you might hesitate over.** To decide a paragraph's direction, the extension reads that
paragraph's first strong-direction character. That is *processing*, in memory, in the user's own
browser — not *collection*. Google's definition of collection is transmitting data off the user's
machine or retaining it. The extension has no network code at all, so neither can happen. Leave both
boxes unticked; the reasoning is spelled out in the privacy policy in case a reviewer queries it.

## Certifications

Tick all three. All three are true:
- Not selling or transferring user data to third parties
- Not using or transferring user data for purposes unrelated to the item's single purpose
- Not using or transferring user data to determine creditworthiness or for lending purposes

---

## Privacy policy URL

The field is currently empty and Chrome will not let you publish an extension holding a host
permission without one.

```text
https://github.com/shaloml/rtl-chatgpt/blob/main/PRIVACY.md
```

`PRIVACY.md` is in the repository. It must be pushed and publicly reachable **before** you submit —
a 404 here is an instant rejection.
