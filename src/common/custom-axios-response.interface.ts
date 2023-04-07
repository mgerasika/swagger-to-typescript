export interface CustomAxiosResponse<TSuccess, TError> {
    data: TSuccess;
    status: number;
    statusText: string;
    error?: TError;
}
