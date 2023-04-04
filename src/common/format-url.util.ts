import { queryToString } from './query-to-string.util';

export function formatUrl<T = any>(urlStr: string, query?: T): string {
    if (query && Object.keys(query).length) {
        return `${urlStr}?${queryToString(query)}`;
    }
    return urlStr;
}
