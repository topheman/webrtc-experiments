import { makeStore } from "./remote.store.js";
import { createView } from "./remote.container.js";
import {
  getPeerIdFromLacationHash,
  getRemoteNameFromLocalStorage,
  setRemoteNameToLocalStorage,
  makeLogger
} from "./common.js";

function makeButtonClickCallback(store, conn, actionType, logger) {
  return function(e) {
    e.preventDefault();
    if (store.getState().main.masterConnected) {
      logger.log(actionType);
      conn.send({ type: actionType });
    } else {
      console.warn(`${actionType} not sent - connection closed`);
    }
  };
}

function makeFormSubmitCallback(store, conn, logger) {
  return function(e) {
    e.preventDefault();
    if (store.getState().main.masterConnected) {
      const action = {
        type: "REMOTE_SET_NAME",
        name: e.target.querySelector("input").value
      };
      store.dispatch(action);
      conn.send(action);
    } else {
      logger.warn(`REMOTE_SET_NAME not sent - connection closed`);
    }
    setRemoteNameToLocalStorage(e.target.querySelector("input").value);
  };
}

let incrementCallback, decrementCallback, formSubitCallback;
function setupUI(store, conn, logger) {
  document
    .querySelector(".counter-control-add")
    .removeEventListener("click", incrementCallback);
  incrementCallback = makeButtonClickCallback(
    store,
    conn,
    "COUNTER_INCREMENT",
    logger
  );
  document
    .querySelector(".counter-control-add")
    .addEventListener("click", incrementCallback, false);
  document
    .querySelector(".counter-control-sub")
    .removeEventListener("click", decrementCallback);
  decrementCallback = makeButtonClickCallback(
    store,
    conn,
    "COUNTER_DECREMENT",
    logger
  );
  document
    .querySelector(".counter-control-sub")
    .addEventListener("click", decrementCallback, false);
  document
    .querySelector(".form-set-name")
    .removeEventListener("submit", formSubitCallback, false);
  formSubitCallback = makeFormSubmitCallback(store, conn, logger);
  document
    .querySelector(".form-set-name")
    .addEventListener("submit", formSubitCallback, false);
  document.querySelector(
    ".form-set-name input"
  ).value = getRemoteNameFromLocalStorage();
}

function makePeerConnection(peer, masterPeerId, store, logger) {
  const conn = peer.connect(masterPeerId);
  // send a disconnect message to master when reloading/closing
  const onBeforeUnload = () => {
    logger.info(`Sending "REMOTE_DISCONNECT" to ${conn.peer}`);
    conn.send({ type: "REMOTE_DISCONNECT" });
  };
  // make sure to remove a previous added event to prevent double trigger
  window.removeEventListener("beforeunload", onBeforeUnload);
  window.addEventListener("beforeunload", onBeforeUnload);
  conn.on("open", () => {
    store.dispatch({ peerId: conn.peer, type: "MASTER_CONNECT" });
    if (getRemoteNameFromLocalStorage()) {
      conn.send({
        type: "REMOTE_SET_NAME",
        name: getRemoteNameFromLocalStorage()
      });
    }
    logger.info(`Data connection opened with ${masterPeerId}`, conn);
    setupUI(store, conn, logger);
  });
  conn.on("data", data => {
    store.dispatch({ peerId: conn.peer, ...data });
  });
  return conn;
}

function makePeerRemote(masterPeerId, store, logger) {
  const peer = new Peer();
  peer.on("open", peerId => {
    logger.info(`Peer object created, ${JSON.stringify({ peerId })}`);
    store.dispatch({ type: "SIGNAL_OPEN", peerId });
    makePeerConnection(peer, masterPeerId, store, logger);
  });
  // conn.on("close") and conn.on("error") won't catch closing connection
  // tracking by sending a message just before the peer page unloads (covers reload/closing)
  store.subscribe(state => {
    if (
      state.main.masterConnected === false &&
      state.main.lastReconnectAttempt === false
    ) {
      store.dispatch({ type: "REMOTE_RECONNECT", currentTime: new Date() });
      setTimeout(() => {
        logger.warn("connection to master closed, trying to reconnect ...");
        makePeerConnection(peer, masterPeerId, store, logger);
      }, 0);
    }
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
  makePeerRemote(getPeerIdFromLacationHash(), store, logger);
}

init();
