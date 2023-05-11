import { capitalize } from './capitalize.util';

export const getMethodNameFromUrl = (path: string, httpMethod: string): string => {
    return `${path}-${httpMethod}`
        .split(/[-/]/g)
        .map((f) => (f.indexOf('{') === -1 ? f : f.replace(/\s/, '')))
        .join('/')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .split('-')
        .filter((f) => f !== '-')
        .filter((s) => s !== 'api')
        .filter((s) => s !== 'chargebee')
        .map((s, index) => (index > 0 ? capitalize(s) : s.toLowerCase()))
        .join('');
};
