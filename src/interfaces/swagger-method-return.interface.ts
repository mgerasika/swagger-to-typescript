import { ISwaggerModel } from './swagger-model.interface';

export interface ISwaggerMethodReturn {
    isArray: boolean;
    status: string | undefined;
    model: ISwaggerModel | undefined;
}
