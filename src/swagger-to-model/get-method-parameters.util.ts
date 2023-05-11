import { ISwaggerMethodParameter } from "../interfaces/swagger-method-parameter.interface";
import { capitalize } from "../utils/capitalize.util";
import { getPropertyModel } from "./get-property-model.util";

export const getMethodParameters = (
  methodName: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  content: any
): ISwaggerMethodParameter[] | undefined => {
  return content.parameters
    ? content.parameters.map((p: any) => {
        const enumName = p.schema.enum
          ? "E" + capitalize(methodName) + "_" + capitalize(p.name)
          : undefined;
        return {
          name: p.name,
          in: p.in,
          required: p.required,
          type:
            enumName ||
            (p.schema.type === "integer" ? "number" : p.schema.type),
          subModel: p.schema.enum
            ? getPropertyModel(p, { ...p.schema, type: enumName }, p.name)
            : undefined,
        } as ISwaggerMethodParameter;
      })
    : undefined;
};
