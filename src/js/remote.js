import { makeStore } from "./remote.store.js";
import { getPeerIdFromLacationHash } from "./common.js";

function makeButtonClickCallback(store, conn, actionType) {
  return function(e) {
    e.preventDefault();
    if (store.getState().masterConnected) {
      console.log(actionType);
      conn.send({ type: actionType });
    } else {
      console.warn(`${actionType} not sent - connection closed`);
    }
  };
}

function makePeerRemote(masterPeerId, store) {
  const peer = new Peer();
  peer.on("open", peerId => {
    console.log("Peer object created", { peerId });
    const conn = peer.connect(masterPeerId);
    // send a disconnect message to master when reloading/closing
    window.addEventListener("beforeunload", () => {
      console.log(`Sending "REMOTE_DISCONNECT" to ${conn.peer}`);
      conn.send({ type: "REMOTE_DISCONNECT" });
    });
    conn.on("open", () => {
      store.dispatch({ peerId: conn.peer, type: "MASTER_CONNECT" });
      document
        .querySelector(".counter-control-add")
        .addEventListener(
          "click",
          makeButtonClickCallback(store, conn, "COUNTER_INCREMENT"),
          false
        );
      document
        .querySelector(".counter-control-sub")
        .addEventListener(
          "click",
          makeButtonClickCallback(store, conn, "COUNTER_DECREMENT"),
          false
        );
      console.log(`Data connection opened with ${masterPeerId}`, conn);
    });
    conn.on("data", data => {
      store.dispatch({ peerId: conn.peer, ...data });
    });
  });
  peer.on("error", error => console.error(error));
  peer.on("disconnected", e => console.log("disconnected", e));
  return peer;
}

function init() {
  const store = makeStore();
  makePeerRemote(getPeerIdFromLacationHash(), store);
}

init();
