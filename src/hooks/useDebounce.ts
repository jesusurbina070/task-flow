import { useState, useEffect } from 'react';

/**
 * Hook para debouncing de valores.
 * @param value Valor a debouncear.
 * @param delay Tiempo de espera en ms (default 300ms).
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
