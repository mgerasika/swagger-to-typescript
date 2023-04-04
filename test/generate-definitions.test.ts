import { expect } from "@jest/globals";
import { EType } from "../src/enums/type.enum";
import { generateDefinition } from "../src/spec-generation/generate-definitions.util";

describe("generate-definition", () => {
  it("default", () => {
    expect(
      generateDefinition({
        interfaceInfo: {
          name: "IUser",
          content: "",
          data: { firstName: "string" },
          filePath: "",
          id: "IUser",
          type: EType.interface,
        },
      })
    ).toMatchObject({
      IUser: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
          },
        },
      },
    });
  });

  it("with several properties", () => {
    expect(
      generateDefinition({
        interfaceInfo: {
          name: "IUser",
          content: "",
          data: { firstName: "string", age: "number" },
          filePath: "",
          id: "IUser",
          type: EType.interface,
        },
      })
    ).toMatchObject({
      IUser: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
          },
          age: {
            type: "integer",
          },
        },
      },
    });
  });
});
