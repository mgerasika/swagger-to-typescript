import { ISwaggerDoc } from '../interfaces/swagger-doc.interface';
import { ISwaggerMethod } from '../interfaces/swagger-method.interface';
import { StringBuilder } from '../utils/string-builder';

export const generateErrorCodes = (_doc: ISwaggerDoc, methods: ISwaggerMethod[], sb: StringBuilder): void => {
    sb.appendLine(`export type TPartialErrorCodes =`);
    (methods || []).forEach((m) => {
        sb.append(`\n\t | ${m.errorResponseTypeName}`);
    });

    sb.appendLine(`\t | '';\n`);
};
