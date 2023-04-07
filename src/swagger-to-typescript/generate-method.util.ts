import { ISwaggerDoc } from "../interfaces/swagger-doc.interface";
import { ISwaggerMethod } from "../interfaces/swagger-method.interface";
import { StringBuilder } from "../utils/string-builder";
import { getArrayStr } from "./generate-array-str.util";

export const generateMethod = (
  _doc: ISwaggerDoc,
  method: ISwaggerMethod,
  sb: StringBuilder
): void => {
  const bodyParameters: string[] = method.parameters
    ? method.parameters
        .filter((f) => f.in === "path")
        .map((p) => {
          return `${p.name}:${p.type}`;
        })
    : [];

  const queryParameters: string[] = method.parameters
    ? method.parameters
        .filter((f) => f.in === "query")
        .map((p) => {
          return `${p.name}?:${p.type}`;
        })
    : [];

  const headerParameters: string[] = method.parameters
    ? method.parameters
        .filter((f) => f.in === "header")
        .map((p) => {
          const name = p.name.includes("-") ? `['${p.name}']` : p.name;
          return `${name}?:${p.type}`;
        })
    : [];
  bodyParameters.push(
    method.body?.model?.name ? `body: ${method.body?.model?.name}` : ""
  );
  if (queryParameters.length) {
    bodyParameters.push(`query: {${queryParameters.join(",")}} | undefined`);
  }
  if (headerParameters.length) {
    bodyParameters.push(`headers: {${headerParameters.join(",")}}`);
  }
  if (method.summary) {
    sb.appendLine(`\t// ${method.summary}`);
  }

  const returnType = method.successResponse?.isArray
    ? getArrayStr(
        method.successResponse.model,
        method.successResponse.model?.properties,
        0
      )
    : method.successResponse?.model?.name;
  sb.appendLine(
    `${method.name} : (${bodyParameters
      .filter((f) => f)
      .join(", ")}): CustomPromise<CustomAxiosResponse<${
      returnType || "void"
    },${method.errorResponseTypeName || "void"}>,IBEError<${
      method.errorResponseTypeName || "void"
    }>> =>`,
    1
  );
  sb.appendLine(
    "	rs." +
      method.httpMethod +
      "(formatUrl(API_SERVER_URL + `" +
      method.path.replace(/\{/g, "${") +
      "`" +
      (queryParameters.length ? ", query" : "") +
      ") " +
      (method.body?.model?.name ? ", body" : "") +
      (headerParameters.length ? ",{ headers }" : "") +
      "),\n",
    1
  );
};
