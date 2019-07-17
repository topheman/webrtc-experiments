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
      masterConnected: false
    });
  });
});
