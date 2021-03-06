import { makePeerUrl, humanizeErrors } from "./common.js";
import { getGlobalCounterFromMainState } from "./index.store.js";
import "./components/remotes-list.js";
import "./components/qrcode-display.js";
import "./components/errors-display.js";
import "./components/console-display.js";
import "./components/counter-display.js";
import "./components/footer-display.js";

export function createView(templateNode, staticContent, store) {
  const content = document.createElement("div");
  content.appendChild(templateNode);
  content.querySelector(".static-content-wrapper").appendChild(staticContent);
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
  const errorsDisplay = content.querySelector("errors-display");
  const globalCounter = content.querySelector("counter-display.global-counter");
  const qrcodeDisplay = content.querySelector("qrcode-display");
  const buttonOpenRemote = content.querySelector(".open-remote");
  const consoleDisplay = content.querySelector("console-display");
  const footerDisplay = content.querySelector("footer-display");
  footerDisplay.setAttribute("to", new Date().getFullYear());
  store.subscribe(state => {
    if (state.common.peerId || state.common.signalErrors.length > 0) {
      loader.classList.add("hide");
    }
    if (!state.common.peerId || state.common.signalErrors.length > 0) {
      buttonOpenRemote.setAttribute("disabled", "");
    } else {
      buttonOpenRemote.removeAttribute("disabled");
    }
    if (state.common.peerId) {
      qrcodeDisplay.setAttribute("data", makePeerUrl(state.common.peerId));
    } else {
      qrcodeDisplay.removeAttribute("data");
    }
    errorsDisplay.data = state.common.signalErrors;
    remotesList.data = state.main.remotes;
    globalCounter.setAttribute(
      "data",
      getGlobalCounterFromMainState(state.main)
    );
    consoleDisplay.data = [...state.logs].reverse();
  });
  return content;
}
