export interface CustomAxiosResponse<T, TError> {
    data: T;
    status: number;
    statusText: string;
    error?: TError;
}
