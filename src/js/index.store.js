import { createStore, applyMiddleware, compose } from "./redux-lite.js";
import { commonReducer, makeLogsReducer, loggerMiddleware } from "./common.js";

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

const makeRootReducer = () => (state = {}, action) => {
  const logsReducer = makeLogsReducer(20);
  return {
    main: mainReducer(state.main, action),
    common: commonReducer(state.common, action),
    logs: logsReducer(state.logs, action)
  };
};

export function makeStore() {
  const customMiddlewares = [loggerMiddleware];
  const middlewares = applyMiddleware(...customMiddlewares);
  return createStore(
    makeRootReducer(),
    {
      main: { remotes: [] },
      common: { peerId: null, signalErrors: [] }
    },
    compose(middlewares)
  );
}
