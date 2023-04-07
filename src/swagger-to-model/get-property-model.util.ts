import { ISwaggerModel } from "@src/interfaces/swagger-model.interface";
import { getModel } from "./get-model.util";

export const getPropertyModel = (
  root: any,
  propertySchema: any,
  propertyKey: string
): ISwaggerModel | undefined => {
  if (propertySchema.type === "object") {
    return getModel(root, propertySchema, propertyKey);
  } else if (propertySchema.type === "array") {
    if (propertySchema.items["$ref"]) {
      const parts = propertySchema.items["$ref"].split("/");
      const name = parts[parts.length - 1];
      const subSchema = root.components.schemas[name];
      return getModel(root, subSchema, name);
    } else if (propertySchema.items.type) {
      if (propertySchema.items.type === "object") {
        return getModel(root, propertySchema.items, "");
      }
      return {
        name: propertySchema.items.type,
        originalName: propertySchema.items.type,
        type: propertySchema.items.type,
      };
    }
    return getModel(root, propertySchema.items, "items");
  } else if (propertySchema.enum) {
    return {
      name: propertySchema.type,
      originalName: propertySchema.type,
      enum: propertySchema.enum,
      type: "string",
    };
  } else if (propertySchema["$ref"]) {
    const parts = propertySchema["$ref"].split("/");
    const name = parts[parts.length - 1];
    const subSchema = root.components.schemas[name];
    return getModel(root, subSchema, name);
  }
  return undefined;
};
