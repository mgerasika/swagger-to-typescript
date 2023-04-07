import { ISwaggerModel } from "../interfaces/swagger-model.interface";
import { ISwaggerProperty } from "../interfaces/swagger-property.interface";
import { StringBuilder } from "../utils/string-builder";
import { generateModelProperties } from "./generate-model-properties.util";

export const getArrayStr = (
  model: ISwaggerModel | undefined,
  properties: ISwaggerProperty[] | undefined,
  tabCount: number
): string => {
  const sb = new StringBuilder();
  sb.append("Array<");
  if (model?.name) {
    sb.append(model.name);
  } else if (model?.type && !model.properties?.length) {
    sb.append(model.type);
  } else if (model && model.properties?.length) {
    sb.appendLine("{");
    generateModelProperties(model.properties, sb, tabCount + 1);
    sb.append("\t}");
  } else if (properties?.length) {
    sb.appendLine("{");
    generateModelProperties(properties, sb, tabCount + 1);
    sb.append("\t}");
  } else {
    sb.append("any");
  }
  sb.append(">");
  return sb.toString();
};
