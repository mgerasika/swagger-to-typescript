// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const queryToString = (data: any): string => {
    return Object.keys(data)
        .filter((key) => data && data[key] !== undefined)
        .map((key) => {
            return `${key}=${encodeURIComponent(data[key])}`;
        })
        .join('&');
};
