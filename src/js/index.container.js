import { makePeerUrl, makeQRCode } from "./common.js";
import { getGlobalCounterFromMainState } from "./index.store.js";
import "./components/remotes-list.js";

export function createView(content, store) {
  let currentState;
  const loader = content.querySelector(".initial-loading");
  const remotesList = content.querySelector("remotes-list");
  const globalCounter = content.querySelector(".global-counter");
  store.subscribe(() => {
    let previousState = currentState || { main: {}, common: {} };
    currentState = store.getState();
    if (
      currentState.common.peerId !== false &&
      currentState.common.peerId !== previousState.common.peerId
    ) {
      makeQRCode(makePeerUrl(currentState.common.peerId));
      loader.classList.add("hide");
    }
    remotesList.data = currentState.main.remotes;
    globalCounter.textContent = getGlobalCounterFromMainState(
      currentState.main
    );
  });
  return {
    content
  };
}
