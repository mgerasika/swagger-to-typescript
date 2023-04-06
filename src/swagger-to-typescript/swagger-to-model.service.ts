/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { capitalize } from "../utils/capitalize.util";
import { getMethodNameFromUrl } from "../utils/get-method-name-from-url.util";

export interface ISwaggerDoc {
  title?: string;
  methods: ISwaggerMethod[];
  models: ISwaggerModel[];
}

export interface ISwaggerMethod {
  path: string;
  summary: string;
  httpMethod: string;
  tags: string[];
  name: string;
  originalName: string;
  body?: ISwaggerMethodBody;

  successResponse?: ISwaggerMethodReturn;
  errorResponseTypeName: string;
  errorResponses?: ISwaggerMethodReturn[];
  parameters?: ISwaggerMethodParameter[];
}

export interface ISwaggerMethodReturn {
  isArray: boolean;
  status: string | undefined;
  model: ISwaggerModel | undefined;
}

export interface ISwaggerMethodParameter {
  name: string;
  in: "path" | "query" | "header";
  required: boolean;
  type: string;
  subModel?: ISwaggerModel;
}

export interface ISwaggerModel {
  name: string;
  originalName: string;
  type: string;
  properties?: ISwaggerProperty[];
  enum?: string[];
  schema?: string;
  arrayItemModel?: ISwaggerModel | undefined;
}

export interface ISwaggerProperty {
  name: string;
  type: string;
  required?: boolean;
  subModel?: ISwaggerModel;
}
export interface ISwaggerMethodBody {
  required: boolean;
  model?: ISwaggerModel;
}

export const getDoc = (source: any): ISwaggerDoc | undefined => {
  try {
    const models = getModels(source);
    const res = {
      title: source.info?.title,
      methods: getMethods(source, models),
      models,
    };
    // consoleService.log('getDoc', source, res);
    return res;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("getDoc error", e);
  }
  return undefined;
};

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

export const getModels = (source: any): ISwaggerModel[] => {
  return Object.keys(source.components?.schemas).map((key) => {
    const schema = source.components?.schemas[key];
    return getModel(source, schema, key);
  });
};

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
const getPropertyModel = (
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

const getMethodParameters = (
  methodName: string,
  content: any
): ISwaggerMethodParameter[] | undefined => {
  return content.parameters
    ? content.parameters.map((p: any) => {
        const enumName = p.schema.enum
          ? "E" + capitalize(methodName) + "_" + capitalize(p.name)
          : undefined;
        return {
          name: p.name,
          in: p.in,
          required: p.required,
          type:
            enumName ||
            (p.schema.type === "integer" ? "number" : p.schema.type),
          subModel: p.schema.enum
            ? getPropertyModel(p, { ...p.schema, type: enumName }, p.name)
            : undefined,
        } as ISwaggerMethodParameter;
      })
    : undefined;
};

const getSwaggerMethodReturn = (
  content: any,
  statusStr: string,
  models: ISwaggerModel[]
): ISwaggerMethodReturn | undefined => {
  const schema = content.responses[statusStr]?.content
    ? content.responses[statusStr]?.content["application/json"]?.schema
    : undefined;

  if (schema?.type === "array") {
    const res = models.find((x) => x.schema === schema?.items["$ref"]);
    return {
      isArray: true,
      model: res,
      status: statusStr,
    };
  }
  return {
    isArray: false,
    status: statusStr,
    model:
      schema && schema["$ref"]
        ? models.find((x) => x.schema === schema["$ref"])
        : {
            name: schema.type,
            type: schema.type,
            originalName: schema.type,
          },
  };
};
