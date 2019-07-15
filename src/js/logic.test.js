import { reducer } from "./logic";

describe("logic.reducer", () => {
  it("default state - COUNTER_INCREMENT action should resolve to 1", () => {
    expect(reducer(undefined, { type: "COUNTER_INCREMENT" })).toBe(1);
  });
});
