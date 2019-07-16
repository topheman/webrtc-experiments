import { createStore } from "./redux-lite.js";

export function getRemoteFromState(state, remoteId) {
  return (
    state.remotes.find(remote => remote.id === remoteId) || {
      id: remoteId,
      counter: 0
    }
  );
}

export function makeRemoteCounterState(state, remoteId, num) {
  const currentRemote = getRemoteFromState(state, remoteId);
  if (currentRemote) {
    return {
      ...state,
      remotes: [
        ...state.remotes.filter(remote => remote.id !== remoteId),
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
      return makeRemoteCounterState(state, action.id, 1);
    case "COUNTER_DECREMENT":
      return makeRemoteCounterState(state, action.id, -1);
    default:
      return state;
  }
}

export function makeStore() {
  return createStore(reducer, { remotes: [] });
}
