import { reducer } from "./logic";

describe("logic.reducer", () => {
  it("default state - COUNTER_ADD action should resolve to 1", () => {
    expect(reducer(undefined, { type: "COUNTER_ADD" })).toBe(1);
  });
});
