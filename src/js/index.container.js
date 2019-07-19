import { makePeerUrl, makeQRCode } from "./common.js";

export function initView(store) {
  const content = document.getElementById("content");
  let currentState;
  store.subscribe(() => {
    let previousState = currentState || { main: {} };
    currentState = store.getState();
    if (
      currentState.main.peerId !== false &&
      currentState.main.peerId !== previousState.main.peerId
    ) {
      content.innerHTML = `<div class="qrcode"></div>`;
      makeQRCode(makePeerUrl(currentState.main.peerId));
    }
  });
}
