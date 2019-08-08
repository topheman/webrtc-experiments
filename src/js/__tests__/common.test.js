import {
  commonReducer,
  humanizeErrors,
  makeLogsReducer,
  isLocalIp
} from "../common";

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
describe("common.makeLogsReducer", () => {
  it("should append payload on undefined state", () => {
    const logsReducer = makeLogsReducer(3);
    expect(
      logsReducer(undefined, { type: "LOG", payload: "foo", level: "log" })
    ).toEqual([{ type: "LOG", payload: "foo", level: "log", key: 1 }]);
  });
  it("should append payload on empty array", () => {
    const logsReducer = makeLogsReducer(3);
    expect(
      logsReducer([], { type: "LOG", payload: "foo", level: "log" })
    ).toEqual([{ type: "LOG", payload: "foo", level: "log", key: 1 }]);
  });
  it("should append payload on filled array", () => {
    const logsReducer = makeLogsReducer(3);
    expect(
      logsReducer([{ type: "LOG", payload: "bar", level: "log", key: 1 }], {
        type: "LOG",
        payload: "foo",
        level: "log"
      })
    ).toEqual([
      { type: "LOG", payload: "bar", level: "log", key: 1 },
      { type: "LOG", payload: "foo", level: "log", key: 2 }
    ]);
  });
  it("should append payload on filled array and stop at buffer size", () => {
    const logsReducer = makeLogsReducer(3);
    expect(
      logsReducer(
        [
          { type: "LOG", payload: "toto", level: "log", key: 1 },
          { type: "LOG", payload: "tata", level: "log", key: 2 },
          { type: "LOG", payload: "titi", level: "log", key: 3 }
        ],
        { type: "LOG", payload: "tutu", level: "log" }
      )
    ).toEqual([
      { type: "LOG", payload: "tata", level: "log", key: 2 },
      { type: "LOG", payload: "titi", level: "log", key: 3 },
      { type: "LOG", payload: "tutu", level: "log", key: 4 }
    ]);
  });
});
describe("common.isLocalIp", () => {
  it("should return true for 10.0.0.0", () => {
    expect(isLocalIp("10.0.0.0")).toBe(true);
  });
  it("should return true for 172.16.0.0", () => {
    expect(isLocalIp("172.16.0.0")).toBe(true);
  });
  it("should return true for 192.168.0.0", () => {
    expect(isLocalIp("192.168.0.0")).toBe(true);
  });
  it("should return false for 86.0.0.0", () => {
    expect(isLocalIp("86.0.0.0")).toBe(false);
  });
  it("should return false for topheman.com", () => {
    expect(isLocalIp("topheman.com")).toBe(false);
  });
});
