# Store Listing Information

This document contains all the information needed to submit the extension to Chrome Web Store and Microsoft Edge Add-ons.

---

## Extension Name
**Claude AI RTL Transformer**

---

## Short Description (132 characters max)
Hebrew and Arabic that read the right way in Claude AI. Automatic per-paragraph direction, plus per-block RTL/LTR control.

---

## Detailed Description

> Paste the block below verbatim into the store's "Detailed description" field.
> The store renders it as **plain text** — no Markdown — so it is written without any
> formatting syntax. The 16,000 character limit is a ceiling, not a target: this comes to
> roughly 3,400 characters, which is about as much as anyone reads before installing.

```text
Write Hebrew or Arabic to Claude and it comes out backwards. Ask for code and the code comes out backwards too. This extension fixes both, and mostly it does it without you having to touch anything.

WHAT YOU GET

A small floating panel sits at the top of every Claude page with three modes: AUTO, RTL and LTR. Drag it wherever you like — it stays there, and it remembers which mode you chose.


AUTO — THE ONE YOU'LL ACTUALLY USE

AUTO is the default, and for a normal mixed conversation it is the whole product.

Every paragraph works out its own direction from the first real letter in it. A Hebrew paragraph reads right-to-left. An English one reads left-to-right. Code stays left-to-right, always. The sidebar and Claude's own interface stay put.

Crucially, each paragraph makes that decision once and then locks it. Claude's answers stream in a word at a time, and a naive approach flips the text back and forth while you are trying to read it. That does not happen here.

So: you type in Hebrew, Claude answers in Hebrew with an English code block in the middle, and every part of it reads correctly. You didn't click anything.


RTL — WHEN YOU WANT THE WHOLE THING MIRRORED

RTL mode flips the entire interface right-to-left, sidebar and all, the way a Hebrew or Arabic interface should look. Code blocks still read left-to-right, because code always should.


LTR — OFF

Claude exactly as it ships.


WHEN AUTO GETS IT WRONG

It happens — a paragraph that opens with a number, a quote, a stray English word. So every code block, the chat input, and preview cards carry their own small button in the corner. Hover the block and it fades in; click it and just that block flips. Nothing else on the page moves.

The buttons are placed to stay out of Claude's way: they never sit on top of the copy button or the send button, and they don't push the layout around.


IT ALSO WORKS EVERYWHERE ELSE

Click the toolbar icon on any other website and the whole page flips to right-to-left. Click again and it goes back to exactly how it was. Simple, and useful more often than you'd expect.


PRIVACY

The extension reads nothing, collects nothing, and sends nothing anywhere. There is no account, no analytics, no remote code. The only things it stores are your chosen mode and where you dragged the panel, and those live in your own browser.

It has standing permission for claude.ai and for no other site. On other websites it uses activeTab, which means it can only touch a page at the moment you click the icon on it — never in the background, never a site you didn't ask it about.


PERMISSIONS, PLAINLY

• claude.ai access — so the panel is already there when you open Claude, instead of making you click the icon on every single page load.
• activeTab — the plain right-to-left flip on other sites, only on the tab you just clicked.
• scripting — reaches Claude tabs you already had open when the extension installed or updated, so you don't have to reload them by hand.


UPGRADING FROM VERSION 2?

Version 3 needs permission to run on claude.ai automatically — that is what puts the panel there without a click. Chrome always disables an extension that widens its permissions until you approve the change, so after updating you may find this one greyed out.

Nothing is broken. Open the puzzle-piece menu in your toolbar and switch it back on.


Open source, Apache 2.0: https://github.com/shaloml/rtl-chatgpt
Questions or bugs: shaloml@gmail.com
```

### Technical Highlights (for the reviewer notes, not the listing)
- Manifest V3
- Lightweight (36 KB packaged), no external dependencies, no remote code
- No data collection
- Chrome and Edge

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
3.0.0

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