/** from https://dev.to/selbekk/redux-in-27-lines-2i92 */
function createStore(initialReducer, initialState = {}, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(initialReducer, initialState);
  }
  let reducer = initialReducer;
  let subscribers = [];
  let state = reducer(initialState, { type: "__INIT__" });
  return {
    getState() {
      return state;
    },
    dispatch(action) {
      state = reducer(state, action);
      subscribers.forEach(subscriber => subscriber(state));
    },
    subscribe(listener) {
      subscribers.push(listener);
      return () => {
        subscribers = subscribers.filter(subscriber => subscriber !== listener);
      };
    },
    replaceReducer(newReducer) {
      reducer = newReducer;
      this.dispatch({ type: "__REPLACE__" });
    }
  };
}

export function reducer(state = 0, action) {
  switch (action.type) {
    case "ADD":
      return state + 1;
    case "SUB":
      return state - 1;
    default:
      return state;
  }
}

export function makeStore() {
  return createStore(reducer, 0);
}
