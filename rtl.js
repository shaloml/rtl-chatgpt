// Claude AI RTL Transformer — content script (claude.ai).
//
// Lineage: this is a backport of src/rtl-support.js from the sibling project
// claude-desktop-windows-rtl, which was itself adapted from this extension's old
// background.js. It brings back the improvements made there, translated to MV3.
//
// Three modes, chosen from a floating draggable panel pinned top-center
// (AUTO / RTL / LTR), persisted in localStorage under `claude-rtl-mode`:
//   AUTO (default) — decide each message paragraph's direction from its first strong
//     character and pin it once (locked) so streaming never flickers. Hebrew/Arabic
//     go RTL; English and code stay LTR. Sidebar/UI chrome stays LTR.
//   RTL  — force the whole page RTL (sidebar moves right, messages RTL), code stays LTR.
//   LTR  — baseline / off.
//
// Inline per-block chips (code block / composer / preview card) stay available in AUTO
// and RTL for manual overrides. The toolbar icon cycles the modes via a message from
// the service worker (see background.js) — a content script's globals live in an
// isolated world, so the worker cannot call window.claudeRTLToggle directly.

(function () {
  'use strict';

  if (window.claudeRTLInitialized) return;
  window.claudeRTLInitialized = true;

  var MODE_KEY = 'claude-rtl-mode';
  var LEGACY_KEY = 'claude-rtl-enabled';
  var PANEL_ID = 'claude-rtl-panel';
  var LS_LEFT = 'claude-rtl-panel-left';
  var LS_TOP = 'claude-rtl-panel-top';

  // Identity token for this isolated world. Reloading the extension destroys the old
  // world but leaves behind the DOM it built: the panel and chips still look right,
  // but every listener on them is dead. Expandos are per-world, so a node tagged by a
  // previous world reads back as undefined here — that is how reclaimStaleDom() tells
  // our nodes from an earlier world's corpses.
  var WORLD = {};

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, String(v)); } catch (e) {} }

  // Saved mode, else migrate the legacy on/off flag, else AUTO.
  var mode = (function () {
    var m = lsGet(MODE_KEY);
    if (m === 'auto' || m === 'rtl' || m === 'ltr') return m;
    if (lsGet(LEGACY_KEY) === '1') return 'rtl';
    return 'auto';
  })();

  // ---- AUTO: first-strong-character detection (per paragraph, locked once) ----

  // Escapes, never literal characters. Typed as a literal, U+FB1D (HEBREW LETTER YOD
  // WITH HIRIQ) gets decomposed by editors into yod + hiriq, which silently turns the
  // intended U+FB1D..U+FDFD range into U+05B4..U+FDFD -- a range that swallows CJK, Thai
  // and the high surrogate of every emoji, so a reply opening with a checkmark reads as
  // RTL. That bug is live in the project this was ported from.
  var RE_RTL = /[\u0591-\u07FF\u200F\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  var RE_LTR = /[A-Za-z\u200E]/;
  var BLOCK_SEL = 'p,li,h1,h2,h3,h4,h5,h6,blockquote,td,th,dd,dt,summary,figcaption';
  var RESPONSE_SEL = '.font-claude-response';
  var USER_SEL = '[data-testid="user-message"]';
  var SKIP_SEL = 'pre,code,.code-block__code,#' + PANEL_ID;

  function firstStrongDir(text) {
    var r = text.search(RE_RTL);
    var l = text.search(RE_LTR);
    if (r === -1 && l === -1) return null;
    if (r === -1) return 'ltr';
    if (l === -1) return 'rtl';
    return r < l ? 'rtl' : 'ltr';
  }

  function decide(el) {
    if (el.__ccrLocked) return;
    if (el.closest && el.closest(SKIP_SEL)) { el.__ccrLocked = true; return; }
    var dir = firstStrongDir(el.textContent || '');
    if (!dir) return; // still all-neutral; re-check once a strong character streams in
    if (!el.getAttribute('dir')) {
      el.setAttribute('dir', dir);
      el.setAttribute('data-ccr', '');
      el.style.textAlign = dir === 'rtl' ? 'right' : '';
    }
    el.__ccrLocked = true;
  }

  function pushHost(list, host) { if (host && list.indexOf(host) === -1) list.push(host); }

  // Correct for any mutation target: root may BE a host, sit inside one, or contain some.
  function decideWithin(root) {
    if (!root || root.nodeType !== 1) return;

    var responses = [];
    if (root.matches && root.matches(RESPONSE_SEL)) pushHost(responses, root);
    if (root.closest) pushHost(responses, root.closest(RESPONSE_SEL));
    if (root.querySelectorAll) {
      var found = root.querySelectorAll(RESPONSE_SEL);
      for (var f = 0; f < found.length; f++) pushHost(responses, found[f]);
    }
    for (var i = 0; i < responses.length; i++) {
      var blocks = responses[i].querySelectorAll(BLOCK_SEL);
      for (var j = 0; j < blocks.length; j++) decide(blocks[j]);
    }

    // User messages are single-direction containers — decide the whole thing.
    var users = [];
    if (root.matches && root.matches(USER_SEL)) pushHost(users, root);
    if (root.closest) pushHost(users, root.closest(USER_SEL));
    if (root.querySelectorAll) {
      var uf = root.querySelectorAll(USER_SEL);
      for (var u = 0; u < uf.length; u++) pushHost(users, uf[u]);
    }
    for (var k = 0; k < users.length; k++) decide(users[k]);
  }

  function autoSweep() { try { decideWithin(document.body); } catch (e) {} }

  function clearAutoMarks() {
    try {
      var marked = document.querySelectorAll('[data-ccr]');
      for (var i = 0; i < marked.length; i++) {
        marked[i].removeAttribute('dir');
        marked[i].removeAttribute('data-ccr');
        marked[i].style.textAlign = '';
        marked[i].__ccrLocked = false;
      }
    } catch (e) {}
  }

  // ---- per-block override chips ----

  // dir is the block's actual starting direction ('ltr' | 'rtl' | 'auto'), so the chip
  // never lies about what the block is doing.
  function createToggleButton(dir) {
    var button = document.createElement('span');
    button.className = 'claude-rtl-toggle-btn';
    button.textContent = dir.toUpperCase();
    button.setAttribute('data-direction', dir);
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.__ccrWorld = WORLD;
    return button;
  }

  // 'auto' and 'ltr' both flip to RTL; only RTL flips back.
  function nextDir(button) {
    return button.getAttribute('data-direction') === 'rtl' ? 'ltr' : 'rtl';
  }

  function markButton(button, dir) {
    button.setAttribute('data-direction', dir);
    button.textContent = dir.toUpperCase();
  }

  function toggleElementDirection(element, button) {
    var dir = nextDir(button);
    element.style.direction = dir;
    // The attribute, not the inline style, is what beats the blanket !important rule.
    element.setAttribute('data-claude-dir', dir);
    element.style.textAlign = dir === 'rtl' ? 'right' : 'left';
    markButton(button, dir);
  }

  function setFieldsetDir(fieldset, dir) {
    var editor = fieldset.querySelector('.tiptap.ProseMirror')
      || fieldset.querySelector('[contenteditable="true"]');
    if (dir === 'auto') {
      fieldset.setAttribute('dir', 'auto');
      fieldset.style.direction = '';
      fieldset.style.textAlign = '';
      if (editor) {
        editor.setAttribute('dir', 'auto');
        editor.style.direction = '';
        editor.style.textAlign = '';
      }
      return;
    }
    var ta = dir === 'rtl' ? 'right' : 'left';
    fieldset.style.direction = dir;
    fieldset.style.textAlign = ta;
    if (editor) {
      editor.style.direction = dir;
      editor.style.textAlign = ta;
      var overflowParent = editor.closest('.overflow-y-auto');
      if (overflowParent && fieldset.contains(overflowParent)) {
        overflowParent.style.direction = dir;
        overflowParent.style.textAlign = ta;
      }
    }
  }

  function toggleFieldsetDirection(fieldset, button) {
    var dir = nextDir(button);
    setFieldsetDir(fieldset, dir);
    markButton(button, dir);
  }

  function setCardDir(card, dir) {
    var scrollArea = card.querySelector('.overflow-y-auto');
    var textarea = card.querySelector('textarea');
    if (dir === 'auto') {
      card.setAttribute('dir', 'auto');
      card.style.direction = '';
      card.style.textAlign = '';
      if (scrollArea) {
        scrollArea.setAttribute('dir', 'auto');
        scrollArea.style.direction = '';
        scrollArea.style.textAlign = '';
      }
      if (textarea) {
        textarea.setAttribute('dir', 'auto');
        textarea.style.direction = '';
        textarea.style.textAlign = '';
      }
      return;
    }
    var ta = dir === 'rtl' ? 'right' : 'left';
    card.style.direction = dir;
    card.style.textAlign = ta;
    if (scrollArea) { scrollArea.style.direction = dir; scrollArea.style.textAlign = ta; }
    if (textarea) { textarea.style.direction = dir; textarea.style.textAlign = ta; }
  }

  function togglePreviewCardDirection(card, button) {
    var dir = nextDir(button);
    setCardDir(card, dir);
    markButton(button, dir);
  }

  // ---- element processors ----

  // The chip anchors to the code block's frame, which is the nearest ancestor that does
  // NOT scroll. Claude wraps the <pre> in a div.overflow-x-auto; anchoring inside that
  // would make the chip slide out of view as soon as a long line is scrolled sideways.
  // Climbing by overflow rather than by class survives Claude renaming its wrappers.
  function codeBlockHost(codeBlock) {
    var el = codeBlock.parentElement;
    while (el && el !== document.body) {
      var ox = getComputedStyle(el).overflowX;
      if (ox !== 'auto' && ox !== 'scroll') return el;
      el = el.parentElement;
    }
    return codeBlock.parentElement;
  }

  function processCodeBlocks() {
    document.querySelectorAll('.code-block__code').forEach(function (codeBlock) {
      // Cache the host: this runs on every observer flush, and getComputedStyle is not free.
      var host = codeBlock.__ccrHost;
      if (!host || !host.isConnected) {
        host = codeBlockHost(codeBlock);
        if (!host) return;
        codeBlock.__ccrHost = host;
      }
      // Re-asserted every pass: React can drop the class on a re-render.
      host.classList.add('claude-code-host');
      if (host.querySelector('.claude-rtl-toggle-btn')) return;

      codeBlock.style.direction = 'ltr';
      codeBlock.style.textAlign = 'left';

      var button = createToggleButton('ltr');
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleElementDirection(codeBlock, button);
      });
      host.appendChild(button);
    });
  }

  function processFieldsets(initDir) {
    document.querySelectorAll('fieldset.flex.w-full.min-w-0.flex-col').forEach(function (fieldset) {
      var wrapper = fieldset.parentElement;
      var wrapped = !!wrapper && wrapper.classList.contains('claude-fieldset-wrapper');
      // Guard on the chip, not the wrapper: after a stale-world sweep the wrapper
      // survives but its chip is gone, and we still need to rebuild the chip.
      if (wrapped && wrapper.querySelector('.claude-rtl-toggle-btn')) return;

      if (!wrapped) {
        wrapper = document.createElement('div');
        wrapper.className = 'claude-fieldset-wrapper';
        fieldset.parentNode.insertBefore(wrapper, fieldset);
        wrapper.appendChild(fieldset);
      }
      setFieldsetDir(fieldset, initDir);

      var button = createToggleButton(initDir);
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleFieldsetDirection(fieldset, button);
      });
      wrapper.appendChild(button);
    });
  }

  function processPreviewCards(initDir) {
    document.querySelectorAll('.font-ui.rounded-2xl.border').forEach(function (card) {
      var wrapper = card.parentElement;
      var wrapped = !!wrapper && wrapper.classList.contains('claude-preview-card-wrapper');
      if (wrapped && wrapper.querySelector('.claude-rtl-toggle-btn')) return;

      if (!wrapped) {
        wrapper = document.createElement('div');
        wrapper.className = 'claude-preview-card-wrapper';
        card.parentNode.insertBefore(wrapper, card);
        wrapper.appendChild(card);
      }
      setCardDir(card, initDir);

      var button = createToggleButton(initDir);
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePreviewCardDirection(card, button);
      });
      wrapper.insertBefore(button, card);
    });
  }

  // Blanket message RTL — RTL mode only; AUTO decides per paragraph instead.
  function processMessagesBlanket() {
    document.querySelectorAll(RESPONSE_SEL + ', ' + USER_SEL).forEach(function (message) {
      if (message.getAttribute('data-claude-rtl-processed')) return;
      message.style.direction = 'rtl';
      message.style.textAlign = 'right';
      message.setAttribute('data-claude-rtl-processed', 'true');
    });
  }

  // ---- mode machinery ----

  // Drop body-level state and AUTO/blanket marks. Keeps the inline wrappers and chips,
  // and deliberately keeps [data-claude-dir] — a block you flipped by hand stays flipped
  // across mode switches.
  function fullClear() {
    var body = document.body;
    body.removeAttribute('data-claude-rtl');
    body.style.direction = '';
    clearAutoMarks();
    document.querySelectorAll('[data-claude-rtl-processed]').forEach(function (el) {
      el.style.direction = '';
      el.style.textAlign = '';
      el.removeAttribute('data-claude-rtl-processed');
    });
  }

  function processForMode() {
    if (mode === 'rtl') {
      processCodeBlocks();
      processFieldsets('rtl');
      processMessagesBlanket();
      processPreviewCards('rtl');
    } else if (mode === 'auto') {
      processCodeBlocks();
      processFieldsets('auto');
      autoSweep();
      processPreviewCards('auto');
    }
  }

  function applyMode(m) {
    if (m !== 'auto' && m !== 'rtl' && m !== 'ltr') m = 'auto';
    mode = m;
    lsSet(MODE_KEY, m);
    var body = document.body;
    if (!body) return;
    body.setAttribute('data-claude-rtl-mode', m);
    fullClear();
    if (m === 'rtl') {
      body.style.direction = 'rtl';
      body.setAttribute('data-claude-rtl', 'true');
    }
    processForMode();
    updatePanelButtons();
  }

  window.claudeRTLSetMode = function (m) { applyMode(m); };
  window.claudeRTLToggle = function () {
    applyMode(mode === 'auto' ? 'rtl' : (mode === 'rtl' ? 'ltr' : 'auto'));
  };

  // The toolbar icon cycles the modes. The service worker cannot reach into this
  // isolated world, so it sends a message instead. Registered after the init guard so a
  // re-injection cannot double-register it. The guard also keeps the rest of the script
  // alive where chrome.runtime.onMessage is absent (an orphaned world after an extension
  // reload, or a plain page-context injection while debugging).
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
      if (!msg || msg.type !== 'CLAUDE_RTL_CYCLE') return;
      window.claudeRTLToggle();
      sendResponse({ ok: true, mode: mode });
    });
  }

  // ---- floating panel ----

  var btnAuto = null, btnRtl = null, btnLtr = null;

  function setActive(btn, on) {
    if (!btn) return;
    if (on) btn.setAttribute('data-active', '1');
    else btn.removeAttribute('data-active');
  }

  function updatePanelButtons() {
    try {
      setActive(btnAuto, mode === 'auto');
      setActive(btnRtl, mode === 'rtl');
      setActive(btnLtr, mode === 'ltr');
    } catch (e) {}
  }

  function makeBtn(m, label, title) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'ccr-btn';
    b.textContent = label;
    b.title = title;
    b.setAttribute('data-mode', m);
    b.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      applyMode(m);
    });
    return b;
  }

  function enableDrag(panel, grip) {
    var dragging = false, startX = 0, startY = 0, baseLeft = 0, baseTop = 0;

    grip.addEventListener('pointerdown', function (e) {
      dragging = true;
      var rect = panel.getBoundingClientRect();
      baseLeft = rect.left;
      baseTop = rect.top;
      startX = e.clientX;
      startY = e.clientY;
      // Freeze the computed position into explicit left/top and drop the centering
      // transform, so the panel does not jump on the first pointermove.
      panel.style.left = baseLeft + 'px';
      panel.style.top = baseTop + 'px';
      panel.style.right = 'auto';
      panel.style.transform = 'none';
      try { grip.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });

    grip.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var nx = baseLeft + (e.clientX - startX);
      var ny = baseTop + (e.clientY - startY);
      nx = Math.max(0, Math.min(nx, window.innerWidth - panel.offsetWidth));
      ny = Math.max(0, Math.min(ny, window.innerHeight - panel.offsetHeight));
      panel.style.left = nx + 'px';
      panel.style.top = ny + 'px';
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      lsSet(LS_LEFT, parseInt(panel.style.left, 10) || 0);
      lsSet(LS_TOP, parseInt(panel.style.top, 10) || 0);
    }

    grip.addEventListener('pointerup', endDrag);
    grip.addEventListener('pointercancel', endDrag);
  }

  function ensurePanel() {
    if (!document.body) return;
    if (document.getElementById(PANEL_ID)) return;

    var panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.setAttribute('dir', 'ltr'); // never mirror the button order in RTL mode
    panel.__ccrWorld = WORLD;

    var grip = document.createElement('span');
    grip.className = 'ccr-grip';
    grip.textContent = '⠿';
    grip.title = 'Drag';
    panel.appendChild(grip);

    btnAuto = makeBtn('auto', 'AUTO', 'Automatic direction per paragraph');
    btnRtl = makeBtn('rtl', 'RTL', 'Force right-to-left everywhere');
    btnLtr = makeBtn('ltr', 'LTR', 'Force left-to-right everywhere');
    panel.appendChild(btnAuto);
    panel.appendChild(btnRtl);
    panel.appendChild(btnLtr);

    var left = lsGet(LS_LEFT), top = lsGet(LS_TOP);
    if (left !== null && top !== null) {
      panel.style.left = left + 'px';
      panel.style.top = top + 'px';
      panel.style.right = 'auto';
      panel.style.transform = 'none';
    }

    document.body.appendChild(panel);
    enableDrag(panel, grip);
    updatePanelButtons();
  }

  // Reloading the extension leaves the previous world's panel and chips in the DOM with
  // dead listeners. Without this, ensurePanel() and the processors would see them, skip,
  // and the UI would look perfect while being entirely unclickable.
  function reclaimStaleDom() {
    var panel = document.getElementById(PANEL_ID);
    if (panel && panel.__ccrWorld !== WORLD) panel.remove();
    document.querySelectorAll('.claude-rtl-toggle-btn').forEach(function (chip) {
      if (chip.__ccrWorld !== WORLD) chip.remove();
    });
    // The wrappers can stay — they are inert, and the processors now guard on the chip.
  }

  // ---- streaming / SPA observer (batched per frame) ----

  function startObserver() {
    var scheduled = false;
    var pending = [];

    function flush() {
      scheduled = false;
      var batch = pending;
      pending = [];
      try {
        if (mode === 'auto') {
          for (var n = 0; n < batch.length; n++) decideWithin(batch[n]);
          processCodeBlocks();
          processFieldsets('auto');
          processPreviewCards('auto');
        } else if (mode === 'rtl') {
          processCodeBlocks();
          processFieldsets('rtl');
          processMessagesBlanket();
          processPreviewCards('rtl');
        }
        ensurePanel(); // the SPA re-renders can tear the panel out of the DOM
      } catch (e) {}
    }

    var schedule = window.requestAnimationFrame
      ? function () { window.requestAnimationFrame(flush); }
      : function () { setTimeout(flush, 0); };

    var observer = new MutationObserver(function (mutations) {
      if (mode === 'ltr') return;
      for (var i = 0; i < mutations.length; i++) {
        var mu = mutations[i];
        if (mu.type === 'characterData') {
          if (mu.target.parentElement) pending.push(mu.target.parentElement);
          continue;
        }
        var added = mu.addedNodes;
        for (var k = 0; k < added.length; k++) {
          if (added[k].nodeType === 1) pending.push(added[k]);
        }
      }
      if (!scheduled) { scheduled = true; schedule(); }
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function start() {
    reclaimStaleDom();
    ensurePanel();
    applyMode(mode);
    startObserver();
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
