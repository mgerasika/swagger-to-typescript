import { expect } from "@jest/globals";
import { getInterfaceProperties } from "../src/utils/get-interface-properties.util";

describe("get-interface-properties", () => {
  it("default", () => {
    expect(getInterfaceProperties("{x:number}")).toEqual({ x: "number" });

    expect(getInterfaceProperties("{x?:number}")).toEqual({ "x?": "number" });

    expect(getInterfaceProperties("{x:number,y:number;z:number }")).toEqual({
      x: "number",
      y: "number",
      z: "number",
    });
  });
});
