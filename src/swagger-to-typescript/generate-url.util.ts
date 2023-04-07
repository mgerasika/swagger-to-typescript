import { ISwaggerDoc } from "../interfaces/swagger-doc.interface";
import { ISwaggerMethod } from "../interfaces/swagger-method.interface";
import { StringBuilder } from "../utils/string-builder";

export const generateURL = (
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
  sb.appendLine(
    `${method.name}:  (${bodyParameters
      .filter((f) => f)
      .join(", ")}): string => ` +
      "`" +
      method.path.replace(/\{/g, "${") +
      "`,",
    1
  );
};
