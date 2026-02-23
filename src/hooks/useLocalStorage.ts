import { useState, useCallback } from 'react';

/**
 * Hook para persistir estado en localStorage.
 * @param key La clave bajo la cual se guardará el dato.
 * @param initialValue El valor inicial si no hay nada guardado.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para almacenar el valor actual
  // Se usa una función de inicialización para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      // Parsear el JSON almacenado o retornar el initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error al leer localStorage para la clave "${key}":`, error);
      return initialValue;
    }
  });

  // Retornar una versión envuelta de la función setter de useState que
  // persiste el nuevo valor en localStorage.
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función para tener la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar el estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error al guardar en localStorage para la clave "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
