import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { IBEError } from './be-error.interface';
import { CustomPromise } from './custom-promise.interface';

export * from 'axios';
export default axios;

export interface IRequestService<TOptions = unknown> {
    request(httpMethod: string, url: string, _options?: AxiosRequestConfig): CustomPromise;

    get<T, TError>(url: string, options?: TOptions): CustomPromise<T, TError>;

    head<T, TError>(url: string, options?: TOptions): CustomPromise<T, TError>;

    post<T, T2, TError>(url: string, body?: T, options?: TOptions): CustomPromise<T2, TError>;

    put<T, T2, TError>(url: string, body?: T, options?: TOptions): CustomPromise<T2, TError>;

    patch<T, T2, TError>(url: string, body?: T, options?: TOptions): CustomPromise<T2, TError>;

    delete<T2, TError>(url: string, options?: TOptions): CustomPromise<T2, TError>;

    upload<T, TError>(url: string, formData: FormData, options?: TOptions): CustomPromise<T, TError>;
}

class RequestService implements IRequestService {
    request(httpMethod: string, url: string, options: AxiosRequestConfig): CustomPromise<unknown, unknown> {
        if (httpMethod === 'get') {
            return this.get(url, options);
        }
        if (httpMethod === 'post') {
            return this.post(url, options);
        }
        if (httpMethod === 'head') {
            return this.head(url, options);
        }
        if (httpMethod === 'put') {
            return this.put(url, options);
        }
        if (httpMethod === 'patch') {
            return this.patch(url, options);
        }
        if (httpMethod === 'delete') {
            return this.delete(url);
        }

        return Promise.reject('not implemented');
    }

    download(url: string): void {
        this.get(url);
    }

    get<T, TError>(url: string, options?: AxiosRequestConfig): CustomPromise<T, TError> {
        return axios
            .get(url, {
                ...options,
                data: null, // This is workaround for setting "content-type": https://github.com/axios/axios/issues/86
            })
            .catch((error: AxiosError) => {
                return this.handleError(error as unknown as IBEError<TError>);
            }) as unknown as CustomPromise<T, TError>;
    }

    head<T, TError>(url: string, options?: AxiosRequestConfig): CustomPromise<T, TError> {
        return axios
            .head(url, {
                ...options,
                data: null, // This is workaround for setting "content-type": https://github.com/axios/axios/issues/86
            })
            .catch((error: AxiosError) => {
                return this.handleError(error.response as unknown as IBEError<TError>);
            }) as unknown as CustomPromise<T, TError>;
    }

    post<T, T2, TError>(url: string, body?: T, options?: AxiosRequestConfig): CustomPromise<T2, TError> {
        return axios.post(url, body, options).catch((error: AxiosError) => {
            return this.handleError(error as unknown as IBEError<TError>);
        }) as unknown as CustomPromise<T2, TError>;
    }

    put<T, T2, TError>(url: string, body?: T, options?: AxiosRequestConfig): CustomPromise<T2, TError> {
        return axios.put(url, body, options).catch((error: AxiosError) => {
            return this.handleError(error as unknown as IBEError<TError>);
        }) as unknown as CustomPromise<T2, TError>;
    }

    patch<T, T2, TError>(url: string, body?: T, options?: AxiosRequestConfig): CustomPromise<T2, TError> {
        return axios.patch(url, body, options).catch((error: AxiosError) => {
            return this.handleError(error as unknown as IBEError<TError>);
        }) as unknown as CustomPromise<T2, TError>;
    }

    delete<T2, TError>(url: string, options?: AxiosRequestConfig): CustomPromise<T2, TError> {
        return axios
            .delete(url, {
                ...options,
                data: null, // This is workaround for setting "content-type": https://github.com/axios/axios/issues/86
            })
            .catch((error: AxiosError) => {
                return this.handleError(error as unknown as IBEError<TError>);
            }) as unknown as CustomPromise<T2, TError>;
    }

    upload<T, TError>(url: string, formData: FormData, options?: AxiosRequestConfig): CustomPromise<T, TError> {
        return axios
            .post(url, {
                ...options,
                data: formData ? formData : null, // This is workaround for setting "content-type": https://github.com/axios/axios/issues/86
            })
            .catch((error: AxiosError) => {
                return this.handleError(error as unknown as IBEError<TError>);
            }) as unknown as CustomPromise<T, TError>;
    }

    handleError(error: IBEError<unknown>): CustomPromise<unknown, unknown> {
        return Promise.reject(error);
    }

    postForm(url: string, formData: FormData): Promise<unknown> {
        return axios({
            method: 'post',
            url,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
}

export const requestService = new RequestService();
