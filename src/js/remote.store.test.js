import { reducer } from "./remote.store";

describe("remote.store.reducer", () => {
  it("state should turn to masterConnected === true on MASTER_CONNECT", () => {
    expect(reducer(undefined, { type: "MASTER_CONNECT" })).toEqual({
      masterConnected: true
    });
  });
  it("state should turn to masterConnected === false on MASTER_DISCONNECT", () => {
    expect(
      reducer(
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
      reducer(
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
      reducer(
        { masterConnected: true },
        { type: "REMOTE_SET_NAME", name: "foo" }
      )
    ).toEqual({ masterConnected: true, name: "foo" });
  });
});
