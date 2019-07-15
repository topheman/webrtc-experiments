import {
  makePeerUrl,
  makeQRCode,
  getMasterPeerIdFromLocalStorage,
  setMasterPeerIdToLocalStorage
} from "./common.js";
import { makeStore } from "./logic.js";

function makePeerMaster(store) {
  const peer = new Peer(getMasterPeerIdFromLocalStorage());
  const connections = [];
  // send a disconnect message to all clients when reloading/closing
  window.addEventListener("beforeunload", () => {
    console.log("disconnecting", connections);
    connections.forEach(conn => {
      console.log(`Sending "DISCONNECT" to ${conn.peer}`);
      conn.send({ type: "DISCONNECT" });
    });
  });
  peer.on("open", peerId => {
    setMasterPeerIdToLocalStorage(peerId);
    console.log("Peer object created", { peerId });
    makeQRCode(makePeerUrl(peerId));
  });
  peer.on("connection", conn => {
    connections.push(conn);
    console.log(`Data connection opened with ${conn.peer}`, conn);
    conn.on("data", data => {
      console.log("Incomming data", data);
      store.dispatch(data);
      console.log("counter", store.getState());
    });
  });
  peer.on("error", error => console.error(error));
  peer.on("disconnected", e => console.log("disconnected", e));
  return peer;
}

function init() {
  const store = makeStore();
  makePeerMaster(store);
}

init();
