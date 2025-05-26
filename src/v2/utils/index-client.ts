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
export function usePromiseValue<T>(promise: Promise<T>, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    
    promise
      .then((result) => {
        if (isMounted) {
          setValue(result);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [promise]);

  return { value, isLoading, error };
}