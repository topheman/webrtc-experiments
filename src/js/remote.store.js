import { createStore } from "./redux-lite.js";

export function mainReducer(state = { masterConnected: false }, action) {
  switch (action.type) {
    case "MASTER_CONNECT":
      return {
        ...state,
        masterConnected: true
      };
    case "MASTER_DISCONNECT":
      return {
        ...state,
        lastReconnectAttempt: false,
        masterConnected: false
      };
    case "REMOTE_RECONNECT":
      return {
        ...state,
        lastReconnectAttempt: action.currentTime
      };
    case "REMOTE_SET_NAME": {
      return {
        ...state,
        name: action.name
      };
    }
    case "SIGNAL_OPEN":
      if (!action.peerId) {
        throw new Error("Missing peerId argument");
      }
      return {
        ...state,
        peerId: action.peerId
      };
    case "SIGNAL_CLOSE":
      return {
        ...state,
        peerId: false
      };
    default:
      return state;
  }
}

function rootReducer(state = {}, action) {
  return {
    main: mainReducer(state.main, action)
  };
}

export function makeStore() {
  return createStore(rootReducer, { main: { masterConnected: false } });
}
