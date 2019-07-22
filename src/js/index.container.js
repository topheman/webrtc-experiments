import { makePeerUrl, humanizeErrors } from "./common.js";
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
  const alert = content.querySelector(".alert");
  const loader = content.querySelector(".initial-loading");
  const remotesList = content.querySelector("remotes-list");
  const globalCounter = content.querySelector(".global-counter");
  const qrcodeDisplay = content.querySelector("qrcode-display");
  const buttonOpenRemote = content.querySelector(".open-remote");
  store.subscribe(state => {
    if (state.common.peerId || state.common.signalErrors.length > 0) {
      loader.classList.add("hide");
    }
    if (!state.common.peerId || state.common.signalErrors.length > 0) {
      buttonOpenRemote.setAttribute("disabled", "");
    } else {
      buttonOpenRemote.removeAttribute("disabled");
    }
    if (state.common.signalErrors.length > 0) {
      // @todo make an error component
      alert.textContent = humanizeErrors(state.common.signalErrors).join(", ");
      alert.classList.remove("hide");
    } else {
      alert.classList.add("hide");
    }
    if (state.common.peerId) {
      qrcodeDisplay.setAttribute("data", makePeerUrl(state.common.peerId));
    } else {
      qrcodeDisplay.removeAttribute("data");
    }
    remotesList.data = state.main.remotes;
    globalCounter.textContent = getGlobalCounterFromMainState(state.main);
  });
  return content;
}
