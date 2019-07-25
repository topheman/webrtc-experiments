export function createView(templateNode, staticContent, store) {
  const content = document.createElement("div");
  content.appendChild(templateNode);
  content.querySelector(".static-content-wrapper").appendChild(staticContent);
  const loader = content.querySelector(".initial-loading");
  store.subscribe(state => {
    if (state.common.peerId || state.common.signalErrors.length > 0) {
      loader.classList.add("hide");
    }
  });
  return content;
}
