'use client';
// Types that are only client friendly.
export * from './api/index-client';
import { useState, useEffect } from 'react';
/**
 * A custom hook that resolves a promise and returns its value along with loading state
 * @param promise The promise to resolve
 * @param defaultValue Default value to use before the promise resolves
 * @returns An object containing the resolved value, loading state, and any error
 */
export function usePromiseValue(promise, defaultValue) {
    var _a = useState(defaultValue), value = _a[0], setValue = _a[1];
    var _b = useState(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    useEffect(function () {
        var isMounted = true;
        setIsLoading(true);
        promise
            .then(function (result) {
            if (isMounted) {
                setValue(result);
            }
        })
            .catch(function (err) {
            if (isMounted) {
                setError(err instanceof Error ? err : new Error(String(err)));
            }
        })
            .finally(function () {
            if (isMounted) {
                setIsLoading(false);
            }
        });
        return function () {
            isMounted = false;
        };
    }, [promise]);
    return { value: value, isLoading: isLoading, error: error };
}
