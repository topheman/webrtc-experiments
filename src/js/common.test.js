import { commonReducer } from "./common";

describe("common.commonReducer", () => {
  it("default state should be peerId: null, signalError: null", () => {
    expect(commonReducer(undefined, { type: "ANYTHING!!!" })).toEqual({
      peerId: null,
      signalError: null
    });
  });
  it("should track peerId on SIGNAL_OPEN", () => {
    const initialState = {};
    expect(
      commonReducer(initialState, { type: "SIGNAL_OPEN", peerId: "foo" })
    ).toEqual({
      peerId: "foo",
      signalError: null
    });
  });
  it("should reset signalError on SIGNAL_OPEN", () => {
    const initialState = { peerId: null, signalError: "some error" };
    expect(
      commonReducer(initialState, { type: "SIGNAL_OPEN", peerId: "foo" })
    ).toEqual({
      peerId: "foo",
      signalError: null
    });
  });
  it("should remove peerId on SIGNAL_CLOSE", () => {
    const initialState = { peerId: "foo", signalError: null };
    expect(commonReducer(initialState, { type: "SIGNAL_CLOSE" })).toEqual({
      peerId: null,
      signalError: null
    });
  });
  it("should throw if SIGNAL_OPEN is passed without peerId", () => {
    expect(() => commonReducer(undefined, { type: "SIGNAL_OPEN" })).toThrow();
  });
});
