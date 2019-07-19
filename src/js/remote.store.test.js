import { mainReducer } from "./remote.store";

describe("remote.store.mainReducer", () => {
  it("state should turn to masterConnected === true on MASTER_CONNECT", () => {
    expect(mainReducer(undefined, { type: "MASTER_CONNECT" })).toEqual({
      masterConnected: true
    });
  });
  it("state should turn to masterConnected === false on MASTER_DISCONNECT", () => {
    expect(
      mainReducer(
        {
          masterConnected: true
        },
        { type: "MASTER_DISCONNECT" }
      )
    ).toEqual({
      masterConnected: false,
      lastReconnectAttempt: false
    });
  });
  it("state should update lastReconnectAttempt on REMOTE_RECONNECT", () => {
    const currentTime = new Date();
    expect(
      mainReducer(
        {
          masterConnected: false
        },
        { type: "REMOTE_RECONNECT", currentTime }
      )
    ).toEqual({
      masterConnected: false,
      lastReconnectAttempt: currentTime
    });
  });
  it("state should update name on REMOTE_SET_NAME", () => {
    expect(
      mainReducer(
        { masterConnected: true },
        { type: "REMOTE_SET_NAME", name: "foo" }
      )
    ).toEqual({ masterConnected: true, name: "foo" });
  });
  it("should track peerId on SIGNAL_OPEN", () => {
    const initialState = { masterConnected: false };
    expect(
      mainReducer(initialState, { type: "SIGNAL_OPEN", peerId: "foo" })
    ).toEqual({
      masterConnected: false,
      peerId: "foo"
    });
  });
  it("should remove peerId on SIGNAL_CLOSE", () => {
    const initialState = { masterConnected: false };
    expect(mainReducer(initialState, { type: "SIGNAL_CLOSE" })).toEqual({
      masterConnected: false,
      peerId: false
    });
  });
});
