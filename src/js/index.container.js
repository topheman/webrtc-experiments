import { makePeerUrl, makeQRCode } from "./common.js";
import { getGlobalCounterFromMainState } from "./index.store.js";
import "./components/remotes-list.js";

export function createView(content, store) {
  let currentState;
  const remotesList = content.querySelector("remotes-list");
  store.subscribe(() => {
    let previousState = currentState || { main: {}, common: {} };
    currentState = store.getState();
    if (
      currentState.common.peerId !== false &&
      currentState.common.peerId !== previousState.common.peerId
    ) {
      makeQRCode(makePeerUrl(currentState.common.peerId));
    }
    remotesList.data = currentState.main.remotes;
    document.querySelector(
      ".global-counter"
    ).textContent = getGlobalCounterFromMainState(currentState.main);
  });
  return {
    content
  };
}
