export * from './api/index-client';
/**
 * A custom hook that resolves a promise and returns its value along with loading state
 * @param promise The promise to resolve
 * @param defaultValue Default value to use before the promise resolves
 * @returns An object containing the resolved value, loading state, and any error
 */
export declare function usePromiseValue<T>(promise: Promise<T>, defaultValue: T): {
    value: T;
    isLoading: boolean;
    error: Error | null;
};
