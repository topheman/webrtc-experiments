import { makePeerUrl } from "./common.js";
import { getGlobalCounterFromMainState } from "./index.store.js";
import "./components/remotes-list.js";
import "./components/qrcode-display.js";

export function createView(content, store) {
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
  return {
    content
  };
}
