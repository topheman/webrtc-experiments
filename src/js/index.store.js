import { createStore } from "./redux-lite.js";

export function reducer(state = 0, action) {
  switch (action.type) {
    case "COUNTER_INCREMENT":
      return state + 1;
    case "COUNTER_DECREMENT":
      return state - 1;
    default:
      return state;
  }
}

export function makeStore() {
  return createStore(reducer, 0);
}
