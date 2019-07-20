import { createStore } from "./redux-lite.js";
import { commonReducer } from "./common.js";

export function getRemoteFromMainState(state, peerId) {
  return (
    state.remotes.find(remote => remote.peerId === peerId) || {
      peerId,
      counter: 0
    }
  );
}

export function getGlobalCounterFromMainState(state) {
  return state.remotes.reduce((acc, cur) => acc + cur.counter, 0);
}

export function makeRemoteCounterMainState(
  state,
  peerId,
  num,
  connect = false
) {
  const currentRemote = getRemoteFromMainState(state, peerId);
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

export function mainReducer(state = { remotes: [] }, action) {
  switch (action.type) {
    case "COUNTER_INCREMENT":
      return makeRemoteCounterMainState(state, action.peerId, 1);
    case "COUNTER_DECREMENT":
      return makeRemoteCounterMainState(state, action.peerId, -1);
    case "REMOTE_CONNECT":
      return makeRemoteCounterMainState(state, action.peerId, 0);
    case "REMOTE_DISCONNECT":
      return {
        ...state,
        remotes: state.remotes.filter(remote => remote.peerId !== action.peerId)
      };
    case "REMOTE_SET_NAME":
      const currentRemote = getRemoteFromMainState(state, action.peerId);
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
    main: { remotes: [] },
    common: { peerId: false }
  });
}
