import { reducer } from "./logic";

describe("logic.reducer", () => {
  it("default state - ADD function should resolve to 1", () => {
    expect(reducer(undefined, { type: "ADD" })).toBe(1);
  });
});
