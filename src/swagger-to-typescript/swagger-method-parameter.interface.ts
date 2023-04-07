import { ISwaggerModel } from "./swagger-model.interface";

export interface ISwaggerMethodParameter {
  name: string;
  in: "path" | "query" | "header";
  required: boolean;
  type: string;
  subModel?: ISwaggerModel;
}
