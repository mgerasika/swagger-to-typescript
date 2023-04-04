import { expect } from "@jest/globals";
import { generateQueryParameters } from "../src/spec-generation/generate-query-parameters.util";

describe("generate-query-parameters", () => {
  it("default", () => {
    expect(generateQueryParameters({ query: { x: "number" } })).toMatchObject([
      {
        in: "query",
        required: true,
        type: "integer",
      },
    ]);
  });

  it("name should exist", () => {
    expect(generateQueryParameters({ query: { x: "number" } })).toMatchObject([
      {
        name: "x",
      },
    ]);
  });

  it("required query", () => {
    expect(generateQueryParameters({ query: { x: "number" } })).toMatchObject([
      {
        name: "x",
        required: true,
      },
    ]);

    expect(
      generateQueryParameters({ query: { "x?": "number" } })
    ).toMatchObject([
      {
        name: "x",
        required: false,
      },
    ]);
  });
});
