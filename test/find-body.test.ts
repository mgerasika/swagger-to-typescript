import { expect } from "@jest/globals";
import { findBody } from "../src/utils/find-body.util";

describe("find-interface-body", () => {
  it("default", () => {
    expect(
      findBody({ type: "interface", fileContent: "interface A {}" })
    ).toEqual(["interface A {}"]);
    expect(
      findBody({ type: "interface", fileContent: "interface A{}" })
    ).toEqual(["interface A{}"]);
    expect(
      findBody({
        type: "interface",
        fileContent: `interface A{
	  }`,
      })
    ).toEqual([`interface A{}`]);
  });

  it("2 interfaces in one file", () => {
    expect(
      findBody({
        type: "interface",
        fileContent: "interface A {} interface B {}",
      })
    ).toEqual(["interface A {}", "interface B {}"]);
  });

  it("interfaces with generic", () => {
    expect(
      findBody({ type: "interface", fileContent: "interface A<string> {}" })
    ).toEqual(["interface A<string> {}"]);
  });

  it("interfaces with extend", () => {
    expect(
      findBody({
        type: "interface",
        fileContent: "interface A extend string {}",
      })
    ).toEqual(["interface A extend string {}"]);
  });
});
