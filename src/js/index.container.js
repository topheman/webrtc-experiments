import { makePeerUrl, makeQRCode } from "./common.js";

export function initView(store) {
  const content = document.getElementById("content");
  let currentState;
  store.subscribe(() => {
    let previousState = currentState || {};
    currentState = store.getState();
    if (
      currentState.peerId !== false &&
      currentState.peerId !== previousState.peerId
    ) {
      content.innerHTML = `<div class="qrcode"></div>`;
      makeQRCode(makePeerUrl(currentState.peerId));
    }
  });
}
