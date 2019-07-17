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
        masterConnected: false
      };
    default:
      return state;
  }
}

export function makeStore() {
  return createStore(reducer, { masterConnected: false });
}
