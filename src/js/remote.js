import { makeStore } from "./remote.store.js";
import { getPeerIdFromLacationHash } from "./common.js";

function makeButtonClickCallback(store, conn, actionType) {
  return function(e) {
    e.preventDefault();
    if (store.getState().masterConnected) {
      console.log(actionType);
      conn.send({ type: actionType });
    } else {
      console.warn(`${actionType} not sent - connection closed`);
    }
  };
}

function makeFormSubmitCallback(store, conn) {
  return function(e) {
    e.preventDefault();
    if (store.getState().masterConnected) {
      const action = {
        type: "REMOTE_SET_NAME",
        name: e.target.querySelector("input").value
      };
      store.dispatch(action);
      conn.send(action);
    } else {
      console.warn(`REMOTE_SET_NAME not sent - connection closed`);
    }
    // todo save name to localStorage
  };
}

let incrementCallback, decrementCallback, formSubitCallback;
function setupUI(store, conn) {
  document
    .querySelector(".counter-control-add")
    .removeEventListener("click", incrementCallback);
  incrementCallback = makeButtonClickCallback(store, conn, "COUNTER_INCREMENT");
  document
    .querySelector(".counter-control-add")
    .addEventListener("click", incrementCallback, false);
  document
    .querySelector(".counter-control-sub")
    .removeEventListener("click", decrementCallback);
  decrementCallback = makeButtonClickCallback(store, conn, "COUNTER_DECREMENT");
  document
    .querySelector(".counter-control-sub")
    .addEventListener("click", decrementCallback, false);
  document
    .querySelector(".form-set-name")
    .removeEventListener("submit", formSubitCallback, false);
  formSubitCallback = makeFormSubmitCallback(store, conn);
  document
    .querySelector(".form-set-name")
    .addEventListener("submit", formSubitCallback, false);
}

function makePeerConnection(peer, masterPeerId, store) {
  const conn = peer.connect(masterPeerId);
  // send a disconnect message to master when reloading/closing
  const onBeforeUnload = () => {
    console.log(`Sending "REMOTE_DISCONNECT" to ${conn.peer}`);
    conn.send({ type: "REMOTE_DISCONNECT" });
  };
  // make sure to remove a previous added event to prevent double trigger
  window.removeEventListener("beforeunload", onBeforeUnload);
  window.addEventListener("beforeunload", onBeforeUnload);
  conn.on("open", () => {
    store.dispatch({ peerId: conn.peer, type: "MASTER_CONNECT" });
    // todo send SET_NAME if already set
    console.log(`Data connection opened with ${masterPeerId}`, conn);
    setupUI(store, conn);
  });
  conn.on("data", data => {
    store.dispatch({ peerId: conn.peer, ...data });
  });
  return conn;
}

function makePeerRemote(masterPeerId, store) {
  const peer = new Peer();
  peer.on("open", peerId => {
    console.log("Peer object created", { peerId });
    makePeerConnection(peer, masterPeerId, store);
  });
  // conn.on("close") and conn.on("error") won't catch closing connection
  // tracking by sending a message just before the peer page unloads (covers reload/closing)
  store.subscribe(state => {
    if (
      state.masterConnected === false &&
      state.lastReconnectAttempt === false
    ) {
      console.warn("connection to master closed, trying to reconnect ...");
      store.dispatch({ type: "REMOTE_RECONNECT", currentTime: new Date() });
      setTimeout(() => {
        makePeerConnection(peer, masterPeerId, store);
      }, 0);
    }
  });
  peer.on("error", error => console.error(error));
  peer.on("disconnected", e => console.log("disconnected", e));
  return peer;
}

function init() {
  // todo retrieve name from localStorage
  const store = makeStore();
  makePeerRemote(getPeerIdFromLacationHash(), store);
}

init();
