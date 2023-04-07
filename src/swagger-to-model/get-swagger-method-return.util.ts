import { ISwaggerMethodReturn } from "src/interfaces/swagger-method-return.interface";
import { ISwaggerModel } from "src/interfaces/swagger-model.interface";

export const getSwaggerMethodReturn = (
  content: any,
  statusStr: string,
  models: ISwaggerModel[]
): ISwaggerMethodReturn | undefined => {
  const schema = content.responses[statusStr]?.content
    ? content.responses[statusStr]?.content["application/json"]?.schema
    : undefined;

  if (schema?.type === "array") {
    const res = models.find((x) => x.schema === schema?.items["$ref"]);
    return {
      isArray: true,
      model: res,
      status: statusStr,
    };
  }
  return {
    isArray: false,
    status: statusStr,
    model:
      schema && schema["$ref"]
        ? models.find((x) => x.schema === schema["$ref"])
        : {
            name: schema.type,
            type: schema.type,
            originalName: schema.type,
          },
  };
};
