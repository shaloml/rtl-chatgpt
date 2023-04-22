chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: toggleDirection,
    },
    () => {}
  );
});



function toggleDirection() {
  const body = document.body;
  const overflowClassElements = document.querySelectorAll('.overflow-y-auto');

  

  if (body.style.direction === 'rtl') {
    body.style.direction = 'ltr';
    removeCss();
    // for (const element of overflowClassElements) {
    //   element.style.direction = 'inherit';
    //   element.style.display = 'inherit';
    // }
  } else {
    body.style.direction = 'rtl';
    addCss();
    // for (const element of overflowClassElements) {
    //   element.style.direction = 'ltr';
    //   element.style.display = 'flex';
    // }
  }
  function addCss() {
    const css = `
      .overflow-y-auto {
        direction: ltr;
        display: flex;
      }
    `;
  
    const style = document.createElement('style');
    style.id = 'direction-extension-styles';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }
  
  function removeCss() {
    const style = document.getElementById('direction-extension-styles');
  
    if (style) {
      style.remove();
    }
  }
}


