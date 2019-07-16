import { reducer, makeRemoteCounterState } from "./index.store";

describe("index.store.reducer", () => {
  it("Create a new slice of state from remoteId", () => {
    const initialState = { remotes: [] };
    expect(makeRemoteCounterState(initialState, "foo", 1)).toEqual({
      remotes: [{ id: "foo", counter: 1 }]
    });
  });
  it("reducer should create remote if not exist and execute counter", () => {
    const initialState = { remotes: [] };
    expect(
      reducer(initialState, { id: "foo", type: "COUNTER_INCREMENT" })
    ).toEqual({
      remotes: [{ id: "foo", counter: 1 }]
    });
  });
  it("reducer should reuse remote if not exist and execute counter", () => {
    const initialState = { remotes: [{ id: "foo", counter: 1 }] };
    expect(
      reducer(initialState, { id: "foo", type: "COUNTER_INCREMENT" })
    ).toEqual({
      remotes: [{ id: "foo", counter: 2 }]
    });
  });
  it("reducer should also decrement", () => {
    const initialState = { remotes: [{ id: "foo", counter: 1 }] };
    expect(
      reducer(initialState, { id: "foo", type: "COUNTER_DECREMENT" })
    ).toEqual({
      remotes: [{ id: "foo", counter: 0 }]
    });
  });
});
