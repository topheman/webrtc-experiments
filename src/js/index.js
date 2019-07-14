import { makePeerUrl, makeQRCode } from "./common.js";

function makePeerMaster() {
  const peer = new Peer();
  peer.on("open", peerId => {
    console.log("Peer object created", { peerId });
    makeQRCode(makePeerUrl(peerId));
  });
  peer.on("connection", conn => {
    console.log(`Data connection opened with ${conn.peer}`, conn);
    conn.on("data", data => {
      console.log("Incomming data", data);
    });
  });
  return peer;
}

function init() {
  makePeerMaster();
}

init();
