// Service worker. Routes the toolbar click, and nothing else.
//
// Two behaviours, decided by which site the tab is on:
//
//   claude.ai   -> cycle the content script's modes (AUTO -> RTL -> LTR). All the real
//                  logic lives in rtl.js, which the manifest injects automatically.
//                  The content script runs in an isolated world the worker cannot call
//                  into, so the click travels as a message.
//
//   any other   -> a plain whole-page RTL/LTR toggle, one flip per click. Injected on
//     site        demand under `activeTab`, which grants access to the tab only for this
//                  click — so the extension needs no standing permission on other sites
//                  and adds no install warning for them.

const CLAUDE_TABS = { url: ["https://claude.ai/*", "https://*.claude.ai/*"] };

function isClaude(url) {
  try {
    return /(^|\.)claude\.ai$/.test(new URL(url).hostname);
  } catch {
    return false; // no url means no host permission for it, so it is not claude.ai
  }
}

async function inject(tabId) {
  await chrome.scripting.insertCSS({ target: { tabId }, files: ["rtl.css"] });
  await chrome.scripting.executeScript({ target: { tabId }, files: ["rtl.js"] });
}

// Runs in the page. Flips the document between RTL and LTR, remembering what the page
// had before so a second click restores it rather than guessing "ltr".
function toggleSimpleDirection() {
  const root = document.documentElement;

  if (root.hasAttribute("data-simple-rtl")) {
    root.dir = root.getAttribute("data-simple-rtl-prev") || "";
    if (!root.dir) root.removeAttribute("dir");
    root.removeAttribute("data-simple-rtl");
    root.removeAttribute("data-simple-rtl-prev");
    document.body.style.direction = "";
    return "ltr";
  }

  root.setAttribute("data-simple-rtl-prev", root.dir || "");
  root.setAttribute("data-simple-rtl", "true");
  root.dir = "rtl";
  document.body.style.direction = "rtl";
  return "rtl";
}

async function toggleSimple(tabId) {
  try {
    await chrome.scripting.executeScript({ target: { tabId }, func: toggleSimpleDirection });
  } catch {
    // chrome://, the Web Store, the PDF viewer — activeTab cannot reach these. Nothing
    // to do, and an unhandled rejection here would badge the extension card with an error.
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id == null) return;

  // A claude.ai tab with the content script loaded answers this. Anything else does not.
  try {
    await chrome.tabs.sendMessage(tab.id, { type: "CLAUDE_RTL_CYCLE" });
    return;
  } catch {
    // "Could not establish connection": no content script in this tab.
  }

  // A claude.ai tab that predates the install/update never got one — inject it now.
  // tab.url is populated here because we hold host permissions for claude.ai.
  if (isClaude(tab.url || "")) {
    try {
      await inject(tab.id);
      await chrome.tabs.sendMessage(tab.id, { type: "CLAUDE_RTL_CYCLE" });
      return;
    } catch {
      // Fall through: better a plain toggle than nothing.
    }
  }

  await toggleSimple(tab.id);
});

// Content scripts are not injected retroactively: claude.ai tabs that were already open
// when the extension was installed or reloaded would otherwise stay dead until a manual
// page refresh.
chrome.runtime.onInstalled.addListener(async () => {
  for (const tab of await chrome.tabs.query(CLAUDE_TABS)) {
    try {
      await inject(tab.id);
    } catch {
      // Discarded or prerendered tab.
    }
  }
});
