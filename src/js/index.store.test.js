import { reducer, makeRemoteCounterState } from "./index.store";

describe("index.store.reducer", () => {
  it("Create a new slice of state from peerId", () => {
    const initialState = { remotes: [] };
    expect(makeRemoteCounterState(initialState, "foo", 1)).toEqual({
      remotes: [{ peerId: "foo", counter: 1 }]
    });
  });
  it("reducer should create remote if peerId does not exist and execute counter", () => {
    const initialState = { remotes: [] };
    expect(
      reducer(initialState, { peerId: "foo", type: "COUNTER_INCREMENT" })
    ).toEqual({
      remotes: [{ peerId: "foo", counter: 1 }]
    });
  });
  it("reducer should reuse remote if peerId exists and execute counter", () => {
    const initialState = { remotes: [{ peerId: "foo", counter: 1 }] };
    expect(
      reducer(initialState, { peerId: "foo", type: "COUNTER_INCREMENT" })
    ).toEqual({
      remotes: [{ peerId: "foo", counter: 2 }]
    });
  });
  it("reducer should also decrement", () => {
    const initialState = { remotes: [{ peerId: "foo", counter: 1 }] };
    expect(
      reducer(initialState, { peerId: "foo", type: "COUNTER_DECREMENT" })
    ).toEqual({
      remotes: [{ peerId: "foo", counter: 0 }]
    });
  });
});
