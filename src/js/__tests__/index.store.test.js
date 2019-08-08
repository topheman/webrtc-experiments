import { mainReducer, makeRemoteCounterMainState } from "../index.store";

describe("index.store.mainReducer", () => {
  it("Create a new slice of state from peerId", () => {
    const initialState = { remotes: [] };
    expect(makeRemoteCounterMainState(initialState, "foo", 1)).toEqual({
      remotes: [{ peerId: "foo", counter: 1 }]
    });
  });
  it("mainReducer should init remote on connect", () => {
    const initialState = { remotes: [] };
    expect(
      mainReducer(initialState, { peerId: "foo", type: "REMOTE_CONNECT" })
    ).toEqual({
      remotes: [{ peerId: "foo", counter: 0 }]
    });
  });
  it("mainReducer should remove remote on disconnect", () => {
    const initialState = {
      remotes: [{ peerId: "foo", counter: 0 }, { peerId: "bar", counter: 0 }]
    };
    expect(
      mainReducer(initialState, { peerId: "bar", type: "REMOTE_DISCONNECT" })
    ).toEqual({
      remotes: [{ peerId: "foo", counter: 0 }]
    });
  });
  it("mainReducer should create remote if peerId does not exist and execute counter", () => {
    const initialState = { remotes: [] };
    expect(
      mainReducer(initialState, { peerId: "foo", type: "COUNTER_INCREMENT" })
    ).toEqual({
      remotes: [{ peerId: "foo", counter: 1 }]
    });
  });
  it("mainReducer should reuse remote if peerId exists and execute counter", () => {
    const initialState = { remotes: [{ peerId: "foo", counter: 1 }] };
    expect(
      mainReducer(initialState, { peerId: "foo", type: "COUNTER_INCREMENT" })
    ).toEqual({
      remotes: [{ peerId: "foo", counter: 2 }]
    });
  });
  it("mainReducer should also decrement", () => {
    const initialState = { remotes: [{ peerId: "foo", counter: 1 }] };
    expect(
      mainReducer(initialState, { peerId: "foo", type: "COUNTER_DECREMENT" })
    ).toEqual({
      remotes: [{ peerId: "foo", counter: 0 }]
    });
  });
  it("mainReducer should add remote", () => {
    const initialState = { remotes: [{ peerId: "foo", counter: 1 }] };
    expect(
      mainReducer(initialState, { peerId: "bar", type: "COUNTER_INCREMENT" })
    ).toEqual({
      remotes: [{ peerId: "foo", counter: 1 }, { peerId: "bar", counter: 1 }]
    });
  });
  it("mainReducer should name specific remote on REMOTE_SET_NAME", () => {
    const initialState = {
      remotes: [{ peerId: "foo", counter: 0 }, { peerId: "bar", counter: 0 }]
    };
    expect(
      mainReducer(initialState, {
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
