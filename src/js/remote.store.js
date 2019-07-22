import { createStore, applyMiddleware, compose } from "./redux-lite.js";
import { commonReducer, makeLogsReducer, loggerMiddleware } from "./common.js";

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
      main: { masterConnected: false },
      common: { peerId: null, signalErrors: [] }
    },
    compose(middlewares)
  );
}
