import { makePeerUrl, makeQRCode } from "./common.js";

export function initView(store) {
  const content = document.getElementById("content");
  let currentState;
  store.subscribe(() => {
    let previousState = currentState || { main: {}, common: {} };
    currentState = store.getState();
    if (
      currentState.common.peerId !== false &&
      currentState.common.peerId !== previousState.common.peerId
    ) {
      content.innerHTML = `<div class="qrcode"></div>`;
      makeQRCode(makePeerUrl(currentState.common.peerId));
    }
  });
}
