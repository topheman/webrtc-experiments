import { getRemoteNameFromSessionStorage } from "./common.js";

export function createView(templateNode, staticContent, store, events) {
  const content = document.createElement("div");
  content.appendChild(templateNode);
  content.querySelector(".static-content-wrapper").appendChild(staticContent);
  const loader = content.querySelector(".initial-loading");
  const formInput = content.querySelector(".form-set-name input");
  formInput.value = getRemoteNameFromSessionStorage();
  // event delegation
  content.addEventListener(
    "click",
    e => {
      if (e.target.classList.contains("counter-control-add")) {
        events.incrementCounter();
        return;
      }
      if (e.target.classList.contains("counter-control-sub")) {
        events.decrementCounter();
        return;
      }
    },
    false
  );
  content.addEventListener(
    "submit",
    e => {
      if (e.target.classList.contains("form-set-name")) {
        e.preventDefault();
        events.updateRemoteName(e.target.querySelector("input").value);
        return;
      }
    },
    false
  );
  store.subscribe(state => {
    if (state.common.peerId || state.common.signalErrors.length > 0) {
      loader.classList.add("hide");
    }
  });
  return content;
}
