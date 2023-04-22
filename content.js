chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const elements = document.querySelectorAll(".overflow-y-auto");
  if (request.action === "toggleDirection") {
    if (document.body.style.direction === "rtl") {
      document.body.style.direction = "ltr";
      elements.forEach((element) => {
        element.style.direction = "";
        element.style.display = "";
      });
    } else {
      document.body.style.direction = "rtl";
      elements.forEach((element) => {
        element.style.direction = "ltr";
        element.style.display = "flex";
      });
    }
  }
});
