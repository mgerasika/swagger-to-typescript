import { ISwaggerDoc } from '../interfaces/swagger-doc.interface';
import { ISwaggerMethod } from '../interfaces/swagger-method.interface';
import { StringBuilder } from '../utils/string-builder';

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
