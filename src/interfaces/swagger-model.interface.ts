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
