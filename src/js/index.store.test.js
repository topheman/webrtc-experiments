import { reducer, makeRemoteCounterState } from "./index.store";

describe("index.store.reducer", () => {
  it("Create a new slice of state from peerId", () => {
    const initialState = { remotes: [] };
    expect(makeRemoteCounterState(initialState, "foo", 1)).toEqual({
      remotes: [{ peerId: "foo", counter: 1 }]
    });
  });
  it("reducer should init remote on connect", () => {
    const initialState = { remotes: [] };
    expect(
      reducer(initialState, { peerId: "foo", type: "REMOTE_CONNECT" })
    ).toEqual({
      remotes: [{ peerId: "foo", counter: 0 }]
    });
  });
  it("reducer should remove remote on disconnect", () => {
    const initialState = {
      remotes: [{ peerId: "foo", counter: 0 }, { peerId: "bar", counter: 0 }]
    };
    expect(
      reducer(initialState, { peerId: "bar", type: "REMOTE_DISCONNECT" })
    ).toEqual({
      remotes: [{ peerId: "foo", counter: 0 }]
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
  it("reducer should add remote", () => {
    const initialState = { remotes: [{ peerId: "foo", counter: 1 }] };
    expect(
      reducer(initialState, { peerId: "bar", type: "COUNTER_INCREMENT" })
    ).toEqual({
      remotes: [{ peerId: "foo", counter: 1 }, { peerId: "bar", counter: 1 }]
    });
  });
  it("reducer should name specific remote on REMOTE_SET_NAME", () => {
    const initialState = {
      remotes: [{ peerId: "foo", counter: 0 }, { peerId: "bar", counter: 0 }]
    };
    expect(
      reducer(initialState, {
        peerId: "bar",
        type: "REMOTE_SET_NAME",
        name: "Hello World!"
      })
    ).toEqual({
      remotes: [
        { peerId: "foo", counter: 0 },
        { peerId: "bar", counter: 0, name: "Hello World!" }
      ]
    });
  });
});
