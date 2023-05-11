import { ISwaggerDoc } from "../interfaces/swagger-doc.interface";
import { getMethods } from "./get-methods.util";
import { getModels } from "./get-models.util";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getDoc = (source: any): ISwaggerDoc | undefined => {
  try {
    const models = getModels(source);
    const res = {
      title: source.info?.title,
      methods: getMethods(source, models),
      models,
    };
    return res;
  } catch (e) {
    console.error("getDoc error", e);
  }
  return undefined;
};
