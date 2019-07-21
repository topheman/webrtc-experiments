import { commonReducer } from "./common";

describe("common.commonReducer", () => {
  it("default state should be peerId: null", () => {
    expect(commonReducer(undefined, { type: "ANYTHING!!!" })).toEqual({
      peerId: null
    });
  });
  it("should track peerId on SIGNAL_CLOSE", () => {
    const initialState = {};
    expect(
      commonReducer(initialState, { type: "SIGNAL_OPEN", peerId: "foo" })
    ).toEqual({
      peerId: "foo"
    });
  });
  it("should remove peerId on SIGNAL_CLOSE", () => {
    const initialState = { peerId: "foo" };
    expect(commonReducer(initialState, { type: "SIGNAL_CLOSE" })).toEqual({
      peerId: null
    });
  });
  it("should throw if SIGNAL_OPEN is passed without peerId", () => {
    expect(() => commonReducer(undefined, { type: "SIGNAL_OPEN" })).toThrow();
  });
});
