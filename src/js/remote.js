import { getPeerIdFromLacationHash } from "./common.js";

function makePeerRemote(masterPeerId) {
  const peer = new Peer();
  let connOpen = false;
  peer.on("open", peerId => {
    console.log("Peer object created", { peerId });
    const conn = peer.connect(masterPeerId);
    conn.on("open", () => {
      connOpen = true;
      document
        .querySelector(".counter-control-add")
        .addEventListener("click", () => {
          if (connOpen) {
            console.log("COUNTER_ADD");
            conn.send({ type: "COUNTER_ADD", id: peerId });
          } else {
            console.warn("COUNTER_ADD not sent - connection closed");
          }
        });
      document
        .querySelector(".counter-control-sub")
        .addEventListener("click", () => {
          if (connOpen) {
            console.log("SUB");
            conn.send({ type: "COUNTER_SUB", id: peerId });
          } else {
            console.warn("COUNTER_SUB not sent - connection closed");
          }
        });
      console.log(`Data connection opened with ${masterPeerId}`, conn);
    });
    conn.on("data", data => {
      console.log("Incomming data", data);
      if (data && data.type === "DISCONNECT") {
        connOpen = false;
      }
    });
  });
  peer.on("error", error => console.error(error));
  peer.on("disconnected", e => console.log("disconnected", e));
  return peer;
}

function init() {
  makePeerRemote(getPeerIdFromLacationHash());
}

init();
