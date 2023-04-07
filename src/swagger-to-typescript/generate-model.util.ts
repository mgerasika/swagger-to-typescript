import { ISwaggerModel } from "@src/interfaces/swagger-model.interface";
import { StringBuilder } from "@src/utils/string-builder";
import { getArrayStr } from "./generate-array-str.util";
import { generateModelProperties } from "./generate-model-properties.util";

export const generateModel = (
  model: ISwaggerModel,
  sb: StringBuilder
): void => {
  if (model.name) {
    if (model.type === "array") {
      sb.appendLine(
        `export type ${model.name} = ${getArrayStr(
          model.arrayItemModel,
          model.properties,
          1
        )};`
      );
      // sb.appendLine(`export type ${model.name} = Array<${model.arrayItemModel?.name}>;`);
    } else {
      sb.appendLine(`export interface ${model.name} {`);
      generateModelProperties(model.properties, sb, 1);
      sb.appendLine(`}`);
    }
  }
};
