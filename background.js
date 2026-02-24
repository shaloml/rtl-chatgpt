chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: initializeClaudeRTL,
    },
    () => {}
  );
});

function initializeClaudeRTL() {
  // If already initialized, toggle body direction instead
  if (window.claudeRTLInitialized) {
    toggleBodyDirection();
    return;
  }
  window.claudeRTLInitialized = true;

  // Add global styles
  addGlobalStyles();

  // Initialize existing elements
  processExistingElements();

  // Watch for new elements
  startObserver();

  function toggleBodyDirection() {
    const body = document.body;
    const currentDir = body.style.direction || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';

    body.style.direction = newDir;

    if (newDir === 'rtl') {
      body.setAttribute('data-claude-rtl', 'true');
      processMessages();
      processPreviewCards();
    } else {
      body.removeAttribute('data-claude-rtl');
      // Clear inline RTL styles from processed messages
      const processed = document.querySelectorAll('[data-claude-rtl-processed]');
      processed.forEach((el) => {
        el.style.direction = '';
        el.style.textAlign = '';
        el.removeAttribute('data-claude-rtl-processed');
      });
    }
  }

  function addGlobalStyles() {
    if (document.getElementById('claude-rtl-extension-styles')) {
      return;
    }

    const css = `
      .claude-rtl-toggle-btn {
        display: inline-block;
        position: relative;
        margin-right: 10px;
        float: right;
        clear: both;
        z-index: 10;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 6px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: system-ui, -apple-system, sans-serif;
      }

      .claude-rtl-toggle-btn:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: scale(1.05);
      }

      .claude-rtl-toggle-btn:active {
        transform: scale(0.95);
      }

      .claude-fieldset-wrapper {
        position: relative;
      }

      .claude-fieldset-wrapper .claude-rtl-toggle-btn {
        right: 12px;
        bottom: 12px;
        top: auto;
        left: auto;
        opacity: 1;
        pointer-events: auto;
      }

      .code-block__code {
        position: relative;
      }


      /* Keep sidebar LTR */
      body[data-claude-rtl="true"] nav .overflow-y-auto,
      body[data-claude-rtl="true"] aside .overflow-y-auto {
        direction: ltr !important;
      }

      /* Move sidebar to right side */
      body[data-claude-rtl="true"] nav.fixed {
        left: auto !important;
        right: 0 !important;
        border-right-width: 0 !important;
        border-left-width: 0.5px;
        border-left-style: solid;
        border-left-color: inherit;
      }

      /* Message content RTL via CSS cascade */
      body[data-claude-rtl="true"] .font-claude-response,
      body[data-claude-rtl="true"] [data-testid="user-message"] {
        direction: rtl;
        text-align: right;
      }

      /* Code blocks default to LTR */
      body[data-claude-rtl="true"] .code-block__code {
        direction: ltr !important;
        text-align: left !important;
      }

      /* Allow override when explicitly toggled to RTL */
      body[data-claude-rtl="true"] .code-block__code[data-claude-dir="rtl"] {
        direction: rtl !important;
        text-align: right !important;
      }

      /* ProseMirror input inherits from fieldset */
      body[data-claude-rtl="true"] .tiptap.ProseMirror {
        direction: inherit;
        text-align: inherit;
      }

      /* Preview card toggle button positioning */
      .claude-preview-card-wrapper {
        position: relative;
      }

      .claude-preview-card-wrapper > .claude-rtl-toggle-btn {
        position: absolute;
        top: 8px;
        left: 8px;
        float: none;
        margin: 0;
        z-index: 20;
        opacity: 0.7;
      }

      .claude-preview-card-wrapper > .claude-rtl-toggle-btn:hover {
        opacity: 1;
      }
    `;

    const style = document.createElement('style');
    style.id = 'claude-rtl-extension-styles';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function createToggleButton(isCodeBlock = false) {
    const button = document.createElement('span');
    button.className = 'claude-rtl-toggle-btn';
    button.textContent = isCodeBlock ? 'LTR' : 'RTL';
    button.setAttribute('data-direction', isCodeBlock ? 'ltr' : 'rtl');
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    return button;
  }

  function toggleElementDirection(element, button, applyToChildren = false) {
    const currentDir = button.getAttribute('data-direction');
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';

    element.style.direction = newDir;
    element.setAttribute('data-claude-dir', newDir);

    // Remove text-align: left if switching to RTL
    if (newDir === 'rtl') {
      element.style.textAlign = 'right';
    } else {
      element.style.textAlign = 'left';
    }

    // Apply to all children if specified (for fieldsets)
    if (applyToChildren) {
      const allChildren = element.querySelectorAll('*');
      allChildren.forEach((child) => {
        child.style.direction = newDir;
        if (newDir === 'rtl') {
          child.style.textAlign = 'right';
        } else {
          // Only set left if it was explicitly set
          const computedAlign = getComputedStyle(child).textAlign;
          if (computedAlign === 'right' || computedAlign === 'start') {
            child.style.textAlign = 'left';
          }
        }
      });
    }

    button.setAttribute('data-direction', newDir);
    button.textContent = newDir.toUpperCase();
  }

  function processCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.code-block__code');

    codeBlocks.forEach((codeBlock) => {
      // Skip if already has toggle button in parent
      if (codeBlock.parentElement?.querySelector('.claude-rtl-toggle-btn')) {
        return;
      }

      // Set default direction to LTR for code blocks
      codeBlock.style.direction = 'ltr';
      codeBlock.style.textAlign = 'left';

      // Create and add toggle button
      const button = createToggleButton(true);
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleElementDirection(codeBlock, button);
      });

      // Insert button before the code block (outside the frame)
      if (codeBlock.parentElement) {
        codeBlock.parentElement.insertBefore(button, codeBlock);
      }
    });
  }

  function processFieldsets() {
    const fieldsets = document.querySelectorAll('fieldset.flex.w-full.min-w-0.flex-col');

    fieldsets.forEach((fieldset) => {
      // Skip if already wrapped
      if (fieldset.parentElement?.classList.contains('claude-fieldset-wrapper')) {
        return;
      }

      // Set RTL on fieldset itself
      fieldset.style.direction = 'rtl';
      fieldset.style.textAlign = 'right';

      // Target ProseMirror editor and its overflow wrapper inside the fieldset
      const editor = fieldset.querySelector('.tiptap.ProseMirror') || fieldset.querySelector('[contenteditable="true"]');
      if (editor) {
        editor.style.direction = 'rtl';
        editor.style.textAlign = 'right';
        // Also set RTL on the .overflow-y-auto wrapper parent of the editor
        const overflowParent = editor.closest('.overflow-y-auto');
        if (overflowParent && fieldset.contains(overflowParent)) {
          overflowParent.style.direction = 'rtl';
          overflowParent.style.textAlign = 'right';
        }
      }

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'claude-fieldset-wrapper';

      // Insert wrapper before fieldset
      fieldset.parentNode.insertBefore(wrapper, fieldset);

      // Move fieldset into wrapper
      wrapper.appendChild(fieldset);

      // Create and add toggle button
      const button = createToggleButton(false);
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFieldsetDirection(fieldset, button);
      });

      wrapper.appendChild(button);
    });
  }

  function toggleFieldsetDirection(fieldset, button) {
    const currentDir = button.getAttribute('data-direction');
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    const textAlign = newDir === 'rtl' ? 'right' : 'left';

    fieldset.style.direction = newDir;
    fieldset.style.textAlign = textAlign;

    // Toggle ProseMirror editor and its overflow wrapper
    const editor = fieldset.querySelector('.tiptap.ProseMirror') || fieldset.querySelector('[contenteditable="true"]');
    if (editor) {
      editor.style.direction = newDir;
      editor.style.textAlign = textAlign;
      const overflowParent = editor.closest('.overflow-y-auto');
      if (overflowParent && fieldset.contains(overflowParent)) {
        overflowParent.style.direction = newDir;
        overflowParent.style.textAlign = textAlign;
      }
    }

    button.setAttribute('data-direction', newDir);
    button.textContent = newDir.toUpperCase();
  }

  function processMessages() {
    const selectors = '.font-claude-response, [data-testid="user-message"]';
    const messages = document.querySelectorAll(selectors);

    messages.forEach((message) => {
      if (message.getAttribute('data-claude-rtl-processed')) {
        return;
      }
      message.style.direction = 'rtl';
      message.style.textAlign = 'right';
      message.setAttribute('data-claude-rtl-processed', 'true');
    });
  }

  function processPreviewCards() {
    // Target preview cards (email/WhatsApp/message previews) - they have font-ui + rounded-2xl + border
    const cards = document.querySelectorAll('.font-ui.rounded-2xl.border');

    cards.forEach((card) => {
      // Skip if already wrapped
      if (card.parentElement?.classList.contains('claude-preview-card-wrapper')) {
        return;
      }

      // Set RTL on the card itself
      card.style.direction = 'rtl';
      card.style.textAlign = 'right';

      // Set RTL on the scrollable content area inside
      const scrollArea = card.querySelector('.overflow-y-auto');
      if (scrollArea) {
        scrollArea.style.direction = 'rtl';
        scrollArea.style.textAlign = 'right';
      }

      // Set RTL on textarea if present
      const textarea = card.querySelector('textarea');
      if (textarea) {
        textarea.style.direction = 'rtl';
        textarea.style.textAlign = 'right';
      }

      // Wrap the card for toggle button positioning
      const wrapper = document.createElement('div');
      wrapper.className = 'claude-preview-card-wrapper';
      card.parentNode.insertBefore(wrapper, card);
      wrapper.appendChild(card);

      // Create toggle button
      const button = createToggleButton(false);
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePreviewCardDirection(card, button);
      });

      wrapper.insertBefore(button, card);
    });
  }

  function togglePreviewCardDirection(card, button) {
    const currentDir = button.getAttribute('data-direction');
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    const textAlign = newDir === 'rtl' ? 'right' : 'left';

    card.style.direction = newDir;
    card.style.textAlign = textAlign;

    const scrollArea = card.querySelector('.overflow-y-auto');
    if (scrollArea) {
      scrollArea.style.direction = newDir;
      scrollArea.style.textAlign = textAlign;
    }

    const textarea = card.querySelector('textarea');
    if (textarea) {
      textarea.style.direction = newDir;
      textarea.style.textAlign = textAlign;
    }

    button.setAttribute('data-direction', newDir);
    button.textContent = newDir.toUpperCase();
  }

  function processExistingElements() {
    processCodeBlocks();
    processFieldsets();
    processMessages();
    processPreviewCards();

    // Toggle body direction and add marker
    const body = document.body;
    if (body.style.direction !== 'rtl') {
      body.style.direction = 'rtl';
      body.setAttribute('data-claude-rtl', 'true');
    }
  }

  function startObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;

      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldProcess = true;
          break;
        }
      }

      if (shouldProcess) {
        // Debounce processing
        clearTimeout(window.claudeRTLProcessTimeout);
        window.claudeRTLProcessTimeout = setTimeout(() => {
          processCodeBlocks();
          processFieldsets();
          processMessages();
          processPreviewCards();
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}


