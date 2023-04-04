import { StringBuilder } from '../utils/string-builder';
import { ISwaggerDoc, ISwaggerMethod, ISwaggerModel, ISwaggerProperty } from './swagger-to-model.service';

export const swaggerToTypescript = (doc: ISwaggerDoc): string => {
    const sb = new StringBuilder();

    sb.appendLine('');

    doc.models
        .filter((f) => f.enum)
        .forEach((model) => {
            generateEnums(model, sb);
        });

    doc.methods.forEach((model) => {
        model.parameters
            ?.filter((p) => p.subModel)
            .forEach((p) => {
                if (p.subModel?.enum) {
                    generateEnums(p.subModel, sb);
                }
            });
    });

    doc.models
        .filter((f) => !f.enum)
        .forEach((model) => {
            // generate all models except models into errors
            if (!doc.methods.find((m) => m.errorResponses?.find((e) => e.model?.originalName === model.originalName))) {
                generateModel(model, sb);
            }
        });

    doc.methods.forEach((method) => {
        generateMethodErrorCodes(doc, method, sb);
    });

    generateErrorCodes(doc, doc.methods, sb);

    sb.appendLine(`export const createApiRequest = (rs: IRequestService) => ({`);
    doc.methods.forEach((method) => {
        generateMethod(doc, method, sb);
    });
    sb.appendLine(`});`);
    sb.appendLine('');
    sb.appendLine(`const URL = {`);
    doc.methods.forEach((method) => {
        generateURL(doc, method, sb);
    });
    sb.appendLine(`};`);

    return sb.toString();
};

const getArrayStr = (
    model: ISwaggerModel | undefined,
    properties: ISwaggerProperty[] | undefined,
    tabCount: number,
): string => {
    const sb = new StringBuilder();
    sb.append('Array<');
    if (model?.name) {
        sb.append(model.name);
    } else if (model?.type && !model.properties?.length) {
        sb.append(model.type);
    } else if (model && model.properties?.length) {
        sb.appendLine('{');
        generateModelProperties(model.properties, sb, tabCount + 1);
        sb.append('\t}');
    } else if (properties?.length) {
        sb.appendLine('{');
        generateModelProperties(properties, sb, tabCount + 1);
        sb.append('\t}');
    } else {
        sb.append('any');
    }
    sb.append('>');
    return sb.toString();
};

const getPropertyTypeStr = (p: ISwaggerProperty, tabCount: number): string => {
    const sb = new StringBuilder();
    if (p.type === 'integer') {
        sb.append('number');
    } else if (p.type === 'array') {
        sb.append(getArrayStr(p.subModel, p.subModel?.properties, tabCount));
    } else if (p.type === 'object') {
        if (p.subModel && p.subModel.properties?.length) {
            sb.appendLine('{');
            generateModelProperties(p.subModel.properties, sb, tabCount + 1);
            sb.append('\t}');
        } else {
            sb.append('any');
        }
    } else {
        sb.append(p.type);
    }
    return sb.toString();
};

export const generateEnums = (model: ISwaggerModel, sb: StringBuilder): void => {
    sb.appendLine(`export enum ${model.name} {`);
    model.enum?.forEach((enumValue) => {
        const enumName = enumValue.replace(/-/g, '_');
        sb.appendLine(`\t${enumName} = '${enumValue}',`);
    });
    sb.appendLine(`}`);
};

export const generateModel = (model: ISwaggerModel, sb: StringBuilder): void => {
    if (model.name) {
        if (model.type === 'array') {
            sb.appendLine(`export type ${model.name} = ${getArrayStr(model.arrayItemModel, model.properties, 1)};`);
            // sb.appendLine(`export type ${model.name} = Array<${model.arrayItemModel?.name}>;`);
        } else {
            sb.appendLine(`export interface ${model.name} {`);
            generateModelProperties(model.properties, sb, 1);
            sb.appendLine(`}`);
        }
    }
};

const escapeName = (name: string): string =>
    name.includes('[') || name.includes('-') || (name.length && !Number.isNaN(name[0])) ? `'${name}'` : name;
export const generateModelProperties = (
    properties: ISwaggerProperty[] | undefined,
    sb: StringBuilder,
    tabCount: number,
): void => {
    properties?.forEach((p) => {
        const required = p.required ? '' : '?';
        sb.appendLine(`${escapeName(p.name)}${required}: ${getPropertyTypeStr(p, tabCount)};`, tabCount);
    });
};

export const generateErrorCodes = (_doc: ISwaggerDoc, methods: ISwaggerMethod[], sb: StringBuilder): void => {
    sb.appendLine(`export type TPartialErrorCodes =`);
    (methods || []).forEach((m) => {
        sb.append(`\n\t | ${m.errorResponseTypeName}`);
    });

    sb.appendLine(`\t | '';\n`);
};

export const generateMethod = (_doc: ISwaggerDoc, method: ISwaggerMethod, sb: StringBuilder): void => {
    const bodyParameters: string[] = method.parameters
        ? method.parameters
              .filter((f) => f.in === 'path')
              .map((p) => {
                  return `${p.name}:${p.type}`;
              })
        : [];

    const queryParameters: string[] = method.parameters
        ? method.parameters
              .filter((f) => f.in === 'query')
              .map((p) => {
                  return `${p.name}?:${p.type}`;
              })
        : [];

    const headerParameters: string[] = method.parameters
        ? method.parameters
              .filter((f) => f.in === 'header')
              .map((p) => {
                  const name = p.name.includes('-') ? `['${p.name}']` : p.name;
                  return `${name}?:${p.type}`;
              })
        : [];
    bodyParameters.push(method.body?.model?.name ? `body: ${method.body?.model?.name}` : '');
    if (queryParameters.length) {
        bodyParameters.push(`query: {${queryParameters.join(',')}} | undefined`);
    }
    if (headerParameters.length) {
        bodyParameters.push(`headers: {${headerParameters.join(',')}}`);
    }
    if (method.summary) {
        sb.appendLine(`\t// ${method.summary}`);
    }

    const returnType = method.successResponse?.isArray
        ? getArrayStr(method.successResponse.model, method.successResponse.model?.properties, 0)
        : method.successResponse?.model?.name;
    sb.appendLine(
        `${method.name} : (${bodyParameters.filter((f) => f).join(', ')}): CustomPromise<CustomAxiosResponse<${
            returnType || 'void'
        },${method.errorResponseTypeName || 'void'}>,IBEError<${method.errorResponseTypeName || 'void'}>> =>`,
        1,
    );
    sb.appendLine(
        '	rs.' +
            method.httpMethod +
            '(formatUrl(API_SERVER_URL + `' +
            method.path.replace(/\{/g, '${') +
            '`' +
            (queryParameters.length ? ', query' : '') +
            ') ' +
            (method.body?.model?.name ? ', body' : '') +
            (headerParameters.length ? ',{ headers }' : '') +
            '),\n',
        1,
    );
};

export const generateMethodErrorCodes = (_doc: ISwaggerDoc, method: ISwaggerMethod, sb: StringBuilder): void => {
    if (method.errorResponses) {
        const errorModels = method.errorResponses;

        sb.append(`export type ${method.errorResponseTypeName} = ''`);
        errorModels.forEach((model) => {
            sb.append(`\n\t |'${model.model?.originalName}'`);
            model.model?.properties?.forEach((p) => {
                if (p.subModel?.enum) {
                    sb.append(p.subModel.enum.map((e) => `\n\t |'${e}'`).join(''));
                }
            });
        });
        sb.appendLine(`;`);
    }
};

export const generateURL = (_doc: ISwaggerDoc, method: ISwaggerMethod, sb: StringBuilder): void => {
    const bodyParameters: string[] = method.parameters
        ? method.parameters
              .filter((f) => f.in === 'path')
              .map((p) => {
                  return `${p.name}:${p.type}`;
              })
        : [];
    sb.appendLine(
        `${method.name}:  (${bodyParameters.filter((f) => f).join(', ')}): string => ` +
            '`' +
            method.path.replace(/\{/g, '${') +
            '`,',
        1,
    );
};
