import {
  getMasterPeerIdFromLocalStorage,
  setMasterPeerIdToLocalStorage,
  makeLogger
} from "./common.js";
import { getPeerjsConfig } from "./peer-config.js";
import { makeStore } from "./index.store.js";
import { createView } from "./index.container.js";

function makePeerMaster(store, logger) {
  const peer = new Peer(getMasterPeerIdFromLocalStorage(), getPeerjsConfig());
  const connections = [];
  // send a disconnect message to all clients when reloading/closing
  window.addEventListener("beforeunload", () => {
    console.log("disconnecting", connections);
    connections.forEach(conn => {
      logger.info(`Sending "MASTER_DISCONNECT" to ${conn.peer}`);
      conn.send({ type: "MASTER_DISCONNECT" });
    });
  });
  peer.on("open", peerId => {
    setMasterPeerIdToLocalStorage(peerId);
    logger.info(`Peer object created, ${JSON.stringify({ peerId })}`);
    store.dispatch({ peerId, type: "SIGNAL_OPEN" });
  });
  peer.on("connection", conn => {
    connections.push(conn);
    store.dispatch({ peerId: conn.peer, type: "REMOTE_CONNECT" });
    logger.info(`Data connection opened with remote ${conn.peer}`);
    conn.on("data", data => {
      store.dispatch({ peerId: conn.peer, ...data });
    });
  });
  peer.on("error", error => {
    console.error(error);
    store.dispatch({ type: "SIGNAL_ERROR", error: error.message });
  });
  peer.on("disconnected", e => {
    console.log("disconnected", e);
    store.dispatch({ type: "SIGNAL_CLOSE" });
  });
  return peer;
}

function init() {
  const store = makeStore();
  const logger = makeLogger(store);
  // create view based on <template> tag content
  const templateNode = document.importNode(
    document.querySelector("template").content,
    true
  );
  const staticContent = document.querySelector(".static-content");
  const content = createView(templateNode, staticContent, store);
  document.querySelector("#content").innerHTML = "";
  document.querySelector("#content").appendChild(content);
  // create peerjs controller
  makePeerMaster(store, logger);
}

init();
