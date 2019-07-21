import { createStore } from "./redux-lite.js";
import { commonReducer } from "./common.js";

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
    default:
      return state;
  }
}

function rootReducer(state = {}, action) {
  return {
    main: mainReducer(state.main, action),
    common: commonReducer(state.common, action)
  };
}

export function makeStore() {
  return createStore(rootReducer, {
    main: { masterConnected: false },
    common: { peerId: null, signalErrors: [] }
  });
}
