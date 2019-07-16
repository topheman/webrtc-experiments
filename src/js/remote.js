import { getPeerIdFromLacationHash } from "./common.js";

function makePeerRemote(masterPeerId) {
  const peer = new Peer();
  let connOpen = false;
  peer.on("open", peerId => {
    console.log("Peer object created", { peerId });
    const conn = peer.connect(masterPeerId);
    // send a disconnect message to master when reloading/closing
    window.addEventListener("beforeunload", () => {
      console.log(`Sending "REMOTE_DISCONNECT" to ${conn.peer}`);
      conn.send({ type: "REMOTE_DISCONNECT" });
    });
    conn.on("open", () => {
      connOpen = true;
      document
        .querySelector(".counter-control-add")
        .addEventListener("click", () => {
          if (connOpen) {
            console.log("COUNTER_INCREMENT");
            conn.send({ type: "COUNTER_INCREMENT" });
          } else {
            console.warn("COUNTER_INCREMENT not sent - connection closed");
          }
        });
      document
        .querySelector(".counter-control-sub")
        .addEventListener("click", () => {
          if (connOpen) {
            console.log("COUNTER_DECREMENT");
            conn.send({ type: "COUNTER_DECREMENT" });
          } else {
            console.warn("COUNTER_DECREMENT not sent - connection closed");
          }
        });
      console.log(`Data connection opened with ${masterPeerId}`, conn);
    });
    conn.on("data", data => {
      console.log("Incomming data", data);
      if (data && data.type === "MASTER_DISCONNECT") {
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
