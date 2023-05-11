import { ISwaggerMethod } from './swagger-method.interface';
import { ISwaggerModel } from './swagger-model.interface';

export interface ISwaggerDoc {
    title?: string;
    methods: ISwaggerMethod[];
    models: ISwaggerModel[];
}
