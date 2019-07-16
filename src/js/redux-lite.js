/**
 * from https://dev.to/selbekk/redux-in-27-lines-2i92
 */
export function createStore(initialReducer, initialState = {}, enhancer) {
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
      console.log(action, state);
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
