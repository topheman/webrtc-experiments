import { makeStore } from "./remote.store.js";
import { getPeerIdFromLacationHash } from "./common.js";

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
        .addEventListener("click", () => {
          if (store.getState().masterConnected) {
            console.log("COUNTER_INCREMENT");
            conn.send({ type: "COUNTER_INCREMENT" });
          } else {
            console.warn("COUNTER_INCREMENT not sent - connection closed");
          }
        });
      document
        .querySelector(".counter-control-sub")
        .addEventListener("click", () => {
          if (store.getState().masterConnected) {
            console.log("COUNTER_DECREMENT");
            conn.send({ type: "COUNTER_DECREMENT" });
          } else {
            console.warn("COUNTER_DECREMENT not sent - connection closed");
          }
        });
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
