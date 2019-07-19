import { commonReducer } from "./common";

describe("common.commonReducer", () => {
  it("default state should be peerId: false", () => {
    expect(commonReducer(undefined, { type: "ANYTHING!!!" })).toEqual({
      peerId: false
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
    const initialState = { peerId: true };
    expect(commonReducer(initialState, { type: "SIGNAL_CLOSE" })).toEqual({
      peerId: false
    });
  });
  it("should throw if SIGNAL_OPEN is passed without peerId", () => {
    expect(() => commonReducer(undefined, { type: "SIGNAL_OPEN" })).toThrow();
  });
});
