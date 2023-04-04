import { expect } from "@jest/globals";
import { calcSymbolsCount } from "../src/utils/calc-symbols-count.util";

describe("calc-symbols-count", () => {
  it("default", () => {
    expect(calcSymbolsCount("123A345", "A")).toEqual(1);
    expect(calcSymbolsCount("1a1a1", "1")).toEqual(3);
    expect(calcSymbolsCount("1a1a1", "a")).toEqual(2);
  });
});
