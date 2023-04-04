import { expect } from "@jest/globals";
import { generateBodyParameters } from "../src/spec-generation/generate-body-parameters.util";

describe("generate-body-parameters", () => {
  it("default", () => {
    expect(generateBodyParameters({ body: { x: "number" } })).toMatchObject({
      name: "x",
      in: "body",
      required: true,
      type: "integer",
    });
  });

  it("when body interface", () => {
    expect(generateBodyParameters({ body: "IUser" })).toMatchObject({
      in: "body",
      required: true,
      schema: {
        $ref: "#/definitions/IUser",
      },
    });
  });

  it("when body simple type", () => {
    expect(generateBodyParameters({ body: "string" })).toMatchObject({
      in: "body",
      required: true,
      type: "string",
    });

    expect(generateBodyParameters({ body: "number" })).toMatchObject({
      in: "body",
      required: true,
      type: "integer",
    });

    expect(generateBodyParameters({ body: "boolean" })).toMatchObject({
      in: "body",
      required: true,
      type: "boolean",
    });
  });
});
