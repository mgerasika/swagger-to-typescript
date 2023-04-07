import { ISwaggerModel } from "./swagger-model.interface";

export interface ISwaggerProperty {
  name: string;
  type: string;
  required?: boolean;
  subModel?: ISwaggerModel;
}
