import { makePeerUrl, makeQRCode } from "./common.js";
import { makeStore } from "./logic.js";

function makePeerMaster(store) {
  const peer = new Peer();
  peer.on("open", peerId => {
    console.log("Peer object created", { peerId });
    makeQRCode(makePeerUrl(peerId));
  });
  peer.on("connection", conn => {
    console.log(`Data connection opened with ${conn.peer}`, conn);
    conn.on("data", data => {
      console.log("Incomming data", data);
      store.dispatch(data);
      console.log("counter", store.getState());
    });
  });
  return peer;
}

function init() {
  const store = makeStore();
  makePeerMaster(store);
}

init();