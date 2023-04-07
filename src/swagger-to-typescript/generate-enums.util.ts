import { ISwaggerModel } from "../interfaces/swagger-model.interface";
import { StringBuilder } from "../utils/string-builder";

export const generateEnums = (
  model: ISwaggerModel,
  sb: StringBuilder
): void => {
  sb.appendLine(`export enum ${model.name} {`);
  model.enum?.forEach((enumValue) => {
    const enumName = enumValue.replace(/-/g, "_");
    sb.appendLine(`\t${enumName} = '${enumValue}',`);
  });
  sb.appendLine(`}`);
};
