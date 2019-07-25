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

export function getRemoteNameFromSessionStorage() {
  return sessionStorage.getItem(REMOTE_NAME_LOCAL_STORAGE_KEY);
}

export function setRemoteNameToSessionStorage(remoteName) {
  sessionStorage.setItem(REMOTE_NAME_LOCAL_STORAGE_KEY, remoteName);
}

export function humanizeErrors(errors = []) {
  const transform = [
    [
      /ID ".*" is taken/,
      "You may have this main page opened on an other tab, please close it"
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

/**
 * Middleware that redispatch every action as type: "LOG"
 * Also console.log the action / state
 */
export const loggerMiddleware = store => next => action => {
  next(action);
  if (action.type !== "LOG") {
    store.dispatch({ type: "LOG", level: "log", payload: action });
  } else {
    console[action.level || "log"](action.payload, store.getState());
  }
};

/**
 * Reducer that tracks the "LOG" actions
 */
export function makeLogsReducer(bufferSize) {
  return (state = [], action = {}) => {
    switch (action.type) {
      case "LOG":
        return state
          .concat({
            ...action,
            key: (state.slice(-1)[0] || { key: 0 }).key + 1
          })
          .slice(-bufferSize);
      default:
        return state;
    }
  };
}

/**
 * Logger factory that will let you add entries into the store
 */
export const makeLogger = store => ({
  info(msg) {
    store.dispatch({ type: "LOG", level: "info", payload: msg });
  },
  log(msg) {
    store.dispatch({ type: "LOG", level: "log", payload: msg });
  },
  warn(msg) {
    store.dispatch({ type: "LOG", level: "warn", payload: msg });
  },
  error(msg) {
    store.dispatch({ type: "LOG", level: "error", payload: msg });
  }
});

export const isLocalIp = ip => {
  const regexps = [
    /\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/,
    /\b172\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/,
    /\b192\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
  ];
  for (const regexp of regexps) {
    if (regexp.test(ip) === true) {
      return true;
    }
  }
  return false;
};
