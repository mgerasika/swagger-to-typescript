import { ISwaggerDoc } from "src/interfaces/swagger-doc.interface";
import { StringBuilder } from "../utils/string-builder";
import { generateEnums } from "./generate-enums.util";
import { generateErrorCodes } from "./generate-error-codes.util";
import { generateMethodErrorCodes } from "./generate-method-error-codes.util";
import { generateMethod } from "./generate-method.util";
import { generateModel } from "./generate-model.util";
import { generateURL } from "./generate-url.util";

export const swaggerToTypescript = (doc: ISwaggerDoc): string => {
  const sb = new StringBuilder();

  sb.appendLine("");

  doc.models
    .filter((f) => f.enum)
    .forEach((model) => {
      generateEnums(model, sb);
    });

  doc.methods.forEach((model) => {
    model.parameters
      ?.filter((p) => p.subModel)
      .forEach((p) => {
        if (p.subModel?.enum) {
          generateEnums(p.subModel, sb);
        }
      });
  });

  doc.models
    .filter((f) => !f.enum)
    .forEach((model) => {
      // generate all models except models into errors
      if (
        !doc.methods.find((m) =>
          m.errorResponses?.find(
            (e) => e.model?.originalName === model.originalName
          )
        )
      ) {
        generateModel(model, sb);
      }
    });

  doc.methods.forEach((method) => {
    generateMethodErrorCodes(doc, method, sb);
  });

  generateErrorCodes(doc, doc.methods, sb);

  sb.appendLine(`export const createApiRequest = (rs: IRequestService) => ({`);
  doc.methods.forEach((method) => {
    generateMethod(doc, method, sb);
  });
  sb.appendLine(`});`);
  sb.appendLine("");
  sb.appendLine(`const URL = {`);
  doc.methods.forEach((method) => {
    generateURL(doc, method, sb);
  });
  sb.appendLine(`};`);

  return sb.toString();
};











