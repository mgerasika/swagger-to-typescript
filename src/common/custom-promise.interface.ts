export interface CustomPromise<T = unknown, TError = unknown> extends Omit<Promise<T>, 'then' | 'catch'> {
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: TError) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): CustomPromise<TResult1 | TResult2, TError>;

    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
        onrejected?: ((reason: TError) => TResult | PromiseLike<TResult>) | undefined | null,
    ): CustomPromise<T | TResult, TError>;
}
