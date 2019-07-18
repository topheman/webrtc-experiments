import {
  getMasterPeerIdFromLocalStorage,
  setMasterPeerIdToLocalStorage
} from "./common.js";
import { makeStore } from "./index.store.js";
import { initView } from "./index.container.js";

function makePeerMaster(store) {
  const peer = new Peer(getMasterPeerIdFromLocalStorage());
  const connections = [];
  // send a disconnect message to all clients when reloading/closing
  window.addEventListener("beforeunload", () => {
    console.log("disconnecting", connections);
    connections.forEach(conn => {
      console.log(`Sending "MASTER_DISCONNECT" to ${conn.peer}`);
      conn.send({ type: "MASTER_DISCONNECT" });
    });
  });
  peer.on("open", peerId => {
    setMasterPeerIdToLocalStorage(peerId);
    console.log("Peer object created", { peerId });
    store.dispatch({ type: "SIGNAL_OPEN", peerId });
  });
  peer.on("connection", conn => {
    connections.push(conn);
    store.dispatch({ peerId: conn.peer, type: "REMOTE_CONNECT" });
    console.log(`Data connection opened with ${conn.peer}`, conn);
    conn.on("data", data => {
      store.dispatch({ peerId: conn.peer, ...data });
    });
  });
  peer.on("error", error => console.error(error));
  peer.on("disconnected", e => {
    console.log("disconnected", e);
    store.dispatch({ type: "SIGNAL_CLOSE" });
  });
  return peer;
}

function init() {
  const store = makeStore();
  initView(store);
  makePeerMaster(store);
}

init();
