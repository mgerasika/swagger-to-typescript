import { ISwaggerModel } from "../interfaces/swagger-model.interface";
import { getModel } from "./get-model.util";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getModels = (source: any): ISwaggerModel[] => {
  return Object.keys(source.components?.schemas).map((key) => {
    const schema = source.components?.schemas[key];
    return getModel(source, schema, key);
  });
};
