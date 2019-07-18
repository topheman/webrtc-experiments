import { createStore } from "./redux-lite.js";

export function getRemoteFromState(state, peerId) {
  return (
    state.remotes.find(remote => remote.peerId === peerId) || {
      peerId,
      counter: 0
    }
  );
}

export function makeRemoteCounterState(state, peerId, num, connect = false) {
  const currentRemote = getRemoteFromState(state, peerId);
  if (currentRemote) {
    return {
      ...state,
      remotes: [
        ...state.remotes.filter(remote => remote.peerId !== peerId),
        {
          ...currentRemote,
          counter: connect ? 0 : currentRemote.counter + num
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
    case "REMOTE_CONNECT":
      return makeRemoteCounterState(state, action.peerId, 0);
    case "REMOTE_DISCONNECT":
      return {
        ...state,
        remotes: state.remotes.filter(remote => remote.peerId !== action.peerId)
      };
    case "REMOTE_SET_NAME":
      const currentRemote = getRemoteFromState(state, action.peerId);
      if (currentRemote) {
        return {
          ...state,
          remotes: [
            ...state.remotes.filter(remote => remote.peerId !== action.peerId),
            {
              ...currentRemote,
              name: action.name
            }
          ]
        };
      }
      return state;
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

export function makeStore() {
  return createStore(reducer, { remotes: [], peerId: false });
}
