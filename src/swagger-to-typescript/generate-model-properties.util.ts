import { ISwaggerProperty } from "../interfaces/swagger-property.interface";
import { StringBuilder } from "../utils/string-builder";
import { escapeName } from "./escape-name.util";
import { getPropertyTypeStr } from "./generate-property-str.util";

export const generateModelProperties = (
  properties: ISwaggerProperty[] | undefined,
  sb: StringBuilder,
  tabCount: number
): void => {
  properties?.forEach((p) => {
    const required = p.required ? "" : "?";
    sb.appendLine(
      `${escapeName(p.name)}${required}: ${getPropertyTypeStr(p, tabCount)};`,
      tabCount
    );
  });
};
