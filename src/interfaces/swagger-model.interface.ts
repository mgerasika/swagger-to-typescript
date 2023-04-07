import { ISwaggerProperty } from "./swagger-property.interface";

export interface ISwaggerModel {
  name: string;
  originalName: string;
  type: string;
  properties?: ISwaggerProperty[];
  enum?: string[];
  schema?: string;
  arrayItemModel?: ISwaggerModel | undefined;
}
