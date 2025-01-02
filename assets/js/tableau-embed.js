document.querySelectorAll("tableau-viz").forEach((e) => {
  e.click();
  e.iframe.style.height = "100%";
  console.log("Adjusted height");
})
