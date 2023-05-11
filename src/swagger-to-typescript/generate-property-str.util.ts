import { ISwaggerProperty } from 'src/interfaces/swagger-model.interface';
import { StringBuilder } from '../utils/string-builder';
import { getArrayStr } from './generate-array-str.util';
import { generateModelProperties } from './generate-model-properties.util';

export const getPropertyTypeStr = (p: ISwaggerProperty, tabCount: number): string => {
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
