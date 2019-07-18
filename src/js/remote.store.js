import { createStore } from "./redux-lite.js";

export function reducer(state = { masterConnected: false }, action) {
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
    default:
      return state;
  }
}

export function makeStore() {
  return createStore(reducer, { masterConnected: false });
}
