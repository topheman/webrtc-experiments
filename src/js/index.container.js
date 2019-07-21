import { makePeerUrl } from "./common.js";
import { getGlobalCounterFromMainState } from "./index.store.js";
import "./components/remotes-list.js";
import "./components/qrcode-display.js";

export function createView(templateNode, store) {
  const content = document.createElement("div");
  content.appendChild(templateNode);
  content.addEventListener(
    "click",
    e => {
      if (e.target.classList.contains("open-remote")) {
        window.open(makePeerUrl(store.getState().common.peerId));
      }
    },
    false
  );
  const loader = content.querySelector(".initial-loading");
  const remotesList = content.querySelector("remotes-list");
  const globalCounter = content.querySelector(".global-counter");
  const qrcodeDisplay = content.querySelector("qrcode-display");
  store.subscribe(state => {
    if (state.common.peerId) {
      loader.classList.add("hide");
    }
    qrcodeDisplay.setAttribute("data", makePeerUrl(state.common.peerId));
    remotesList.data = state.main.remotes;
    globalCounter.textContent = getGlobalCounterFromMainState(state.main);
  });
  return content;
}
