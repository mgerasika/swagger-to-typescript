import { ISwaggerMethodReturn } from "@src/interfaces/swagger-method-return.interface";
import { ISwaggerMethod } from "@src/interfaces/swagger-method.interface";
import { ISwaggerModel } from "@src/interfaces/swagger-model.interface";
import { capitalize } from "@src/utils/capitalize.util";
import { getMethodNameFromUrl } from "@src/utils/get-method-name-from-url.util";
import { getMethodParameters } from "./get-method-parameters.util";
import { getSwaggerMethodReturn } from "./get-swagger-method-return.util";


export const getMethods = (
  source: any,
  models: ISwaggerModel[]
): ISwaggerMethod[] => {
  return Object.keys(source["paths"])
    .map((key) => {
      const path = source["paths"][key];

      return Object.keys(path).map((httpMethod: string) => {
        const content = path[httpMethod];
        const methodName = getMethodNameFromUrl(key, httpMethod);

        return {
          name: methodName,
          errorResponseTypeName: "T" + capitalize(`${methodName}Error`),
          originalName: key,
          httpMethod,
          summary: content.summary,
          path: key,
          tags: content.tags,
          parameters: getMethodParameters(methodName, content),
          body: {
            required: content.requestBody?.required,
            model: models.find(
              (x) =>
                x.schema ===
                content?.requestBody?.content["application/json"]?.schema[
                  "$ref"
                ]
            ),
          },
          successResponse: Object.keys(content.responses)
            .filter((statusStr) => {
              const status = parseInt(statusStr, 10);
              return status >= 200 && status <= 299;
            })
            .map((statusStr) =>
              getSwaggerMethodReturn(content, statusStr, models)
            )
            .filter((f) => f)[0],

          errorResponses: Object.keys(content.responses)
            .filter((statusStr) => {
              const status = parseInt(statusStr, 10);
              return status >= 400;
            })
            .map(
              (statusStr) =>
                getSwaggerMethodReturn(
                  content,
                  statusStr,
                  models
                ) as ISwaggerMethodReturn
            )
            .filter((f) => f),
        };
      });
    })
    .flat();
};
