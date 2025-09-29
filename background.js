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
    } else {
      body.removeAttribute('data-claude-rtl');
    }
  }

  function addGlobalStyles() {
    if (document.getElementById('claude-rtl-extension-styles')) {
      return;
    }

    const css = `
      .claude-rtl-toggle-btn {
        position: absolute;
        top: 8px;
        left: 8px;
        z-index: 1000;
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
        left: 12px;
        top: 12px;
      }

      .code-block__code {
        position: relative;
      }

      /* Override .overflow-y-auto when RTL is active */
      body[data-claude-rtl="true"] .overflow-y-auto {
        direction: ltr !important;
        display: flex !important;
      }
    `;

    const style = document.createElement('style');
    style.id = 'claude-rtl-extension-styles';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function createToggleButton(isCodeBlock = false) {
    const button = document.createElement('button');
    button.className = 'claude-rtl-toggle-btn';
    button.textContent = isCodeBlock ? 'LTR' : 'RTL';
    button.setAttribute('data-direction', isCodeBlock ? 'ltr' : 'rtl');
    return button;
  }

  function toggleElementDirection(element, button, applyToChildren = false) {
    const currentDir = button.getAttribute('data-direction');
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';

    element.style.direction = newDir;

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
      // Skip if already has toggle button
      if (codeBlock.querySelector('.claude-rtl-toggle-btn')) {
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

      // Make sure the code block is positioned relatively
      if (getComputedStyle(codeBlock).position === 'static') {
        codeBlock.style.position = 'relative';
      }

      codeBlock.appendChild(button);
    });
  }

  function processFieldsets() {
    const fieldsets = document.querySelectorAll('fieldset.flex.w-full.min-w-0.flex-col');

    fieldsets.forEach((fieldset) => {
      // Skip if already wrapped
      if (fieldset.parentElement?.classList.contains('claude-fieldset-wrapper')) {
        return;
      }

      // Set default direction to RTL for conversation fieldsets and all children
      fieldset.style.direction = 'rtl';
      fieldset.style.textAlign = 'right';

      // Apply to all children
      const allChildren = fieldset.querySelectorAll('*');
      allChildren.forEach((child) => {
        child.style.direction = 'rtl';
        child.style.textAlign = 'right';
      });

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
        toggleElementDirection(fieldset, button, true); // Pass true to apply to children
      });

      wrapper.appendChild(button);
    });
  }

  function processExistingElements() {
    processCodeBlocks();
    processFieldsets();

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
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}


