import { ISwaggerDoc } from "@src/interfaces/swagger-doc.interface";
import { ISwaggerMethod } from "@src/interfaces/swagger-method.interface";
import { StringBuilder } from "@src/utils/string-builder";

export const generateErrorCodes = (
  _doc: ISwaggerDoc,
  methods: ISwaggerMethod[],
  sb: StringBuilder
): void => {
  sb.appendLine(`export type TPartialErrorCodes =`);
  (methods || []).forEach((m) => {
    sb.append(`\n\t | ${m.errorResponseTypeName}`);
  });

  sb.appendLine(`\t | '';\n`);
};
