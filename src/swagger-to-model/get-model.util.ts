import { ISwaggerModel } from "@src/interfaces/swagger-model.interface";
import { capitalize } from "@src/utils/capitalize.util";
import { getPropertyModel } from "./get-property-model.util";


export const getModel = (
  root: any,
  schema: any,
  key: string
): ISwaggerModel => {
  let arrayItemModel: ISwaggerModel | undefined = undefined;

  if (schema.type === "array") {
    // consoleService.log('bug here', schema);
    if (!schema.items.properties) {
      const parts = schema.items["$ref"]?.split("/") || [];
      const name = parts[parts.length - 1];
      const subSchema = root.components.schemas[name];
      arrayItemModel = getModel(root, subSchema, name);
    }
  }
  const properties = schema.properties || schema.items?.properties;
  return {
    name: key
      ? schema.enum
        ? (key.toLowerCase().startsWith("e") ? "" : "E") + capitalize(key)
        : "I" + capitalize(key)
      : "",
    originalName: key,
    type: schema.type,
    schema: root.components.schemas[key]
      ? `#/components/schemas/${key}`
      : undefined,
    enum: schema.enum,
    arrayItemModel,
    properties: properties
      ? Object.keys(properties).map((propertyKey: string) => {
          const property = properties[propertyKey];
          const subModel = getPropertyModel(root, property, propertyKey);
          const propertyType =
            property.type === "integer"
              ? "number"
              : property.type || subModel?.name;
          return {
            name: propertyKey,
            type: propertyType,
            required: schema.required?.includes(propertyKey),
            subModel,
          };
        })
      : undefined,
  };
};
