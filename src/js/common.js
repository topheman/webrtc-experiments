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

export function humanizeErrors(errors = []) {
  const transform = [
    [
      /ID ".*" is taken/,
      "You may have the main page opened on an other tab, please close it"
    ]
  ];
  return errors.reduce((errorsList, currentError) => {
    const humanizedCurrentError = transform.reduce(
      (acc, [regExp, replaceError]) => {
        acc = currentError.replace(regExp, replaceError);
        return acc;
      },
      currentError
    );
    errorsList.push(humanizedCurrentError);
    return errorsList;
  }, []);
}

export function commonReducer(
  state = { peerId: null, signalErrors: [] },
  action
) {
  switch (action.type) {
    case "SIGNAL_ERROR":
      return {
        ...state,
        signalErrors: [...state.signalErrors, action.error]
      };
    case "SIGNAL_OPEN":
      if (!action.peerId) {
        throw new Error("Missing peerId argument");
      }
      return {
        ...state,
        signalErrors: [],
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
