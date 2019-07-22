import { commonReducer, humanizeErrors } from "./common";

describe("common.commonReducer", () => {
  it("default state should be peerId: null, signalError: null", () => {
    expect(commonReducer(undefined, { type: "ANYTHING!!!" })).toEqual({
      peerId: null,
      signalErrors: []
    });
  });
  it("should track peerId on SIGNAL_OPEN", () => {
    const initialState = {};
    expect(
      commonReducer(initialState, { type: "SIGNAL_OPEN", peerId: "foo" })
    ).toEqual({
      peerId: "foo",
      signalErrors: []
    });
  });
  it("should reset signalError on SIGNAL_OPEN", () => {
    const initialState = { peerId: null, signalErrors: ["some error"] };
    expect(
      commonReducer(initialState, { type: "SIGNAL_OPEN", peerId: "foo" })
    ).toEqual({
      peerId: "foo",
      signalErrors: []
    });
  });
  it("should append error to signalError on SIGNAL_ERROR", () => {
    const initialState = { peerId: null, signalErrors: ["some error"] };
    expect(
      commonReducer(initialState, {
        type: "SIGNAL_ERROR",
        error: "other error"
      })
    ).toEqual({
      peerId: null,
      signalErrors: ["some error", "other error"]
    });
  });
  it("should remove peerId on SIGNAL_CLOSE", () => {
    const initialState = { peerId: "foo", signalErrors: [] };
    expect(commonReducer(initialState, { type: "SIGNAL_CLOSE" })).toEqual({
      peerId: null,
      signalErrors: []
    });
  });
  it("should throw if SIGNAL_OPEN is passed without peerId", () => {
    expect(() => commonReducer(undefined, { type: "SIGNAL_OPEN" })).toThrow();
  });
});
describe("common.humanizeErrors", () => {
  it("should return an empty array if passed an empty array", () => {
    expect(humanizeErrors([])).toEqual([]);
  });
  it("should ignore non unknown errors", () => {
    expect(humanizeErrors(["foo", "bar"])).toEqual(["foo", "bar"]);
  });
  it("should transform known errors", () => {
    expect(humanizeErrors(["foo", `ID "foo" is taken`, "bar"])).toEqual([
      "foo",
      "You may have this main page opened on an other tab, please close it",
      "bar"
    ]);
  });
});
