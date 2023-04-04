import { expect } from "@jest/globals";
import { generatePathParameters } from "../src/spec-generation/generate-path-parameters.util";

describe("generate-path-parameters", () => {
  it("default", () => {
    expect(generatePathParameters({ params: { x: "number" } })).toMatchObject([
      {
        in: "path",
        required: true,
        type: "integer",
      },
    ]);
  });

  it("name should exist", () => {
    expect(generatePathParameters({ params: { x: "number" } })).toMatchObject([
      {
        name: "x",
      },
    ]);
  });
	
	it("required path argument", () => {
    expect(generatePathParameters({ params: { x: "number" } })).toMatchObject([
      {
        name: "x",
        required: true,
      },
    ]);

    expect(
      generatePathParameters({ params: { "x?": "number" } })
    ).toMatchObject([
      {
        name: "x",
        required: false,
      },
    ]);
  });
});
