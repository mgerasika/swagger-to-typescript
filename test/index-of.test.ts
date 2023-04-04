import { expect } from "@jest/globals";
import { indexOf } from "../src/utils/index-of.util";

describe("indexOf", () => {
  it("default", () => {
    expect(indexOf("123A345", "A", 0)).toEqual(3);
    expect(indexOf("123A345A", "A", 1)).toEqual(7);
    expect(indexOf("123A345A", "A", 2)).toEqual(-1);
  });
});
