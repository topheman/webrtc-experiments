import { getPeerId } from "./common.js";

function makePeerRemote(masterPeerId) {
  const peer = new Peer();
  peer.on("open", peerId => {
    console.log("Peer object created", { peerId });
    const conn = peer.connect(masterPeerId);
    conn.on("open", () => {
      document
        .querySelector(".counter-control-add")
        .addEventListener("click", e => {
          console.log("ADD");
          conn.send({ type: "ADD", id: peerId });
        });
      document
        .querySelector(".counter-control-sub")
        .addEventListener("click", e => {
          console.log("SUB");
          conn.send({ type: "SUB", id: peerId });
        });
      console.log(`Data connection opened with ${masterPeerId}`, conn);
    });
  });
  return peer;
}

function init() {
  makePeerRemote(getPeerId());
}

init();
