import { ISwaggerModel } from "src/interfaces/swagger-model.interface";
import { getModel } from "./get-model.util";

export const getModels = (source: any): ISwaggerModel[] => {
  return Object.keys(source.components?.schemas).map((key) => {
    const schema = source.components?.schemas[key];
    return getModel(source, schema, key);
  });
};
