export interface IBEError<T = string> {
    error: T;
    valid: boolean;
    status: string;
    description?: string;
    clientDescription?: string;
    required_permissions?: string[];
}

export const throwError = (e: IBEError): void => {
    throw e;
};
