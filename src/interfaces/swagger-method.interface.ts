import { ISwaggerMethodBody } from './swagger-method-body.interface';
import { ISwaggerMethodParameter } from './swagger-method-parameter.interface';
import { ISwaggerMethodReturn } from './swagger-method-return.interface';

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
