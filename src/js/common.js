export function makePeerUrl(peerId) {
  return (
    location.origin +
    location.pathname.replace(/\/$/, "") +
    "/remote.html" +
    `#${peerId}`
  );
}

const MASTER_PEER_ID_LOCAL_STORAGE_KEY = "master-peer-id";

export function getMasterPeerIdFromLocalStorage() {
  return localStorage.getItem(MASTER_PEER_ID_LOCAL_STORAGE_KEY);
}

export function setMasterPeerIdToLocalStorage(masterPeerId) {
  localStorage.setItem(MASTER_PEER_ID_LOCAL_STORAGE_KEY, masterPeerId);
}

export function getPeerIdFromLacationHash() {
  return location.hash.replace(/^#/, "");
}

const REMOTE_NAME_LOCAL_STORAGE_KEY = "remote-name";

export function getRemoteNameFromLocalStorage() {
  return localStorage.getItem(REMOTE_NAME_LOCAL_STORAGE_KEY);
}

export function setRemoteNameToLocalStorage(remoteName) {
  localStorage.setItem(REMOTE_NAME_LOCAL_STORAGE_KEY, remoteName);
}

export function commonReducer(
  state = { peerId: null, signalError: null },
  action
) {
  switch (action.type) {
    case "SIGNAL_ERROR":
      return {
        ...state,
        signalError: action.error
      };
    case "SIGNAL_OPEN":
      if (!action.peerId) {
        throw new Error("Missing peerId argument");
      }
      return {
        ...state,
        signalError: null,
        peerId: action.peerId
      };
    case "SIGNAL_CLOSE":
      return {
        ...state,
        peerId: null
      };
    default:
      return state;
  }
}
