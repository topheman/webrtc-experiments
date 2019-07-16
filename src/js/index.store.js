import { createStore } from "./redux-lite.js";

export function getRemoteFromState(state, peerId) {
  return (
    state.remotes.find(remote => remote.peerId === peerId) || {
      peerId,
      counter: 0
    }
  );
}

export function makeRemoteCounterState(state, peerId, num) {
  const currentRemote = getRemoteFromState(state, peerId);
  if (currentRemote) {
    return {
      ...state,
      remotes: [
        ...state.remotes.filter(remote => remote.peerId !== peerId),
        {
          ...currentRemote,
          counter: currentRemote.counter + num
        }
      ]
    };
  }
  return state;
}

export function reducer(state = { remotes: [] }, action) {
  switch (action.type) {
    case "COUNTER_INCREMENT":
      return makeRemoteCounterState(state, action.peerId, 1);
    case "COUNTER_DECREMENT":
      return makeRemoteCounterState(state, action.peerId, -1);
    default:
      return state;
  }
}

export function makeStore() {
  return createStore(reducer, { remotes: [] });
}
