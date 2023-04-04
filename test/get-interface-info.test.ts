import { expect } from "@jest/globals";
import { IInterfaceInfo } from "../src/interfaces/interface-info.interface";
import { getInterfaceInfo } from "../src/utils/get-interface-info.util";

describe("get-interface-info", () => {
  it("default", () => {
    expect(getInterfaceInfo("interface A {}", "")).toMatchObject({
      name: "A",
      data: {},
    } as Partial<IInterfaceInfo>);
  });

  it("with one property in right format", () => {
    expect(
      getInterfaceInfo("interface A {firstName:string;}", "")
    ).toMatchObject({
      name: "A",
      data: {
        firstName: "string",
      },
    } as Partial<IInterfaceInfo>);
  });

  it("with one property in wrong format", () => {
    expect(
      getInterfaceInfo("interface A {firstName:string}", "")
    ).toMatchObject({
      name: "A",
      data: {
        firstName: "string",
      },
    } as Partial<IInterfaceInfo>);
  });

  it("with , or ; separator", () => {
    expect(
      getInterfaceInfo("interface A {firstName:string,}", "")
    ).toMatchObject({
      name: "A",
      data: {
        firstName: "string",
      },
    } as Partial<IInterfaceInfo>);

    expect(
      getInterfaceInfo("interface A {firstName:string;}", "")
    ).toMatchObject({
      name: "A",
      data: {
        firstName: "string",
      },
    } as Partial<IInterfaceInfo>);
  });

  it("with multiple properties", () => {
    expect(
      getInterfaceInfo("interface A {firstName:string,lastName:string}", "")
    ).toMatchObject({
      name: "A",
      data: {
        firstName: "string",
        lastName: "string",
      },
    } as Partial<IInterfaceInfo>);
  });

  it("with multiple properties bad formatted", () => {
    expect(
      getInterfaceInfo(
        `
		interface A {
		//firstName comment
		firstName:string,

		//last name comment
		lastName:string}`,
        ""
      )
    ).toMatchObject({
      name: "A",
      data: {
        firstName: "string",
        lastName: "string",
      },
    } as Partial<IInterfaceInfo>);
  });

  it("with nested object", () => {
    expect(
      getInterfaceInfo("interface A {params:{id:string}}", "")
    ).toMatchObject({
      name: "A",
      data: {
        params: { id: "string" },
      },
    } as Partial<IInterfaceInfo>);
  });
  it("with nested object multiple properties", () => {
    expect(
      getInterfaceInfo("interface A {params:{id:string,id2:string}}", "")
    ).toMatchObject({
      name: "A",
      data: {
        params: { id: "string", id2: "string" },
      },
    } as Partial<IInterfaceInfo>);
  });

  it("with nested object bad formatted", () => {
    expect(
      getInterfaceInfo(
        `interface A {
		params:
		{
		id:string
	}
	;
}`,
        ""
      )
    ).toMatchObject({
      name: "A",
      data: {
        params: { id: "string" },
      },
    } as Partial<IInterfaceInfo>);
  });
});
