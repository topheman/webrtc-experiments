import { makePeerUrl, makeQRCode } from "./common.js";

export function createView(content, store) {
  let currentState;
  store.subscribe(() => {
    let previousState = currentState || { main: {}, common: {} };
    currentState = store.getState();
    if (
      currentState.common.peerId !== false &&
      currentState.common.peerId !== previousState.common.peerId
    ) {
      makeQRCode(makePeerUrl(currentState.common.peerId));
    }
    if (currentState.main.remotes.length > 0) {
      const div = document.createElement("div");
      const lisHtml = currentState.main.remotes
        .map(remote => {
          if (remote.name) {
            div.textContent = remote.name;
          }
          return `<li><span class="remote-peerId">${
            remote.peerId
          }</span> counter: <span class="remote-counter">${
            remote.counter
          }</span>${remote.name ? ` ${div.innerHTML}` : ""}</li>`;
        })
        .join("");
      document.querySelector(".remotes-list").innerHTML = lisHtml;
      const globalCounter = currentState.main.remotes.reduce(
        (acc, cur) => acc + cur.counter,
        0
      );
      document.querySelector(".global-counter").textContent = globalCounter;
    }
  });
  return {
    content
  };
}
