import { makeStore } from "./remote.store.js";
import { createView } from "./remote.container.js";
import {
  getPeerIdFromLacationHash,
  getRemoteNameFromSessionStorage,
  setRemoteNameToSessionStorage,
  makeLogger,
  useEncodePayload
} from "./common.js";

export const isDisconnected = state =>
  !state.common.peerId ||
  state.common.signalErrors.length > 0 ||
  !state.main.masterConnected;

let conn = null;

function makePeerConnection(peer, masterPeerId, store, logger) {
  const { encodePayload, decodePayload } = useEncodePayload();
  conn = peer.connect(masterPeerId);
  // send a disconnect message to master when reloading/closing
  const onBeforeUnload = () => {
    logger.info(`Sending "REMOTE_DISCONNECT" to ${conn.peer}`);
    conn.send(encodePayload({ type: "REMOTE_DISCONNECT" }));
  };
  // make sure to remove a previous added event to prevent double trigger
  window.removeEventListener("beforeunload", onBeforeUnload);
  window.addEventListener("beforeunload", onBeforeUnload);
  conn.on("open", () => {
    store.dispatch({ peerId: conn.peer, type: "MASTER_CONNECT" });
    if (getRemoteNameFromSessionStorage()) {
      conn.send(
        encodePayload({
          type: "REMOTE_SET_NAME",
          name: getRemoteNameFromSessionStorage()
        })
      );
    }
    logger.info(`Data connection opened with master ${masterPeerId}`, conn);
  });
  conn.on("data", data => {
    store.dispatch({ peerId: conn.peer, ...decodePayload(data) });
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

// expose callbacks for events to be attached to the view
function makeUpdateRemoteNameCb(store, logger) {
  const { encodePayload } = useEncodePayload();
  return function(name) {
    if (!isDisconnected(store.getState())) {
      const action = {
        type: "REMOTE_SET_NAME",
        name
      };
      store.dispatch(action);
      conn.send(encodePayload(action));
    } else {
      logger.warn(`REMOTE_SET_NAME not sent - connection closed`);
    }
    setRemoteNameToSessionStorage(name);
  };
}

function makeCounterActionCb(store, logger, actionType) {
  const { encodePayload } = useEncodePayload();
  return function() {
    if (!isDisconnected(store.getState())) {
      logger.log(actionType);
      conn.send(encodePayload({ type: actionType }));
    } else {
      console.warn(`${actionType} not sent - connection closed`);
    }
  };
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
  const content = createView(templateNode, staticContent, store, {
    updateRemoteName: makeUpdateRemoteNameCb(store, logger),
    incrementCounter: makeCounterActionCb(store, logger, "COUNTER_INCREMENT"),
    decrementCounter: makeCounterActionCb(store, logger, "COUNTER_DECREMENT")
  });
  document.querySelector("#content").innerHTML = "";
  document.querySelector("#content").appendChild(content);
  // create peerjs controller
  makePeerRemote(getPeerIdFromLacationHash(), store, logger);
}

init();
