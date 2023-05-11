import { ISwaggerModel } from './swagger-model.interface';

export interface ISwaggerMethodBody {
    required: boolean;
    model?: ISwaggerModel;
}
