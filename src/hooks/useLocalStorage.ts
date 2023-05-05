import { useEffect, useState } from "react";

export const useLocalStorage = <Result = string>(key: string) => {
  const tryStorageValue = (value: string | null) => {
    if (!value) return null;
    try {
      return JSON.parse(value) as Result;
    } catch {
      return value as unknown as Result;
    }
  };

  const getFromStorage = () => {
    const value = localStorage.getItem(key);
    return tryStorageValue(value);
  };

  const [storageValue, setStorageValue] = useState<Result | null>(
    getFromStorage(),
  );

  useEffect(() => {
    const updateLocalStorage = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== window.localStorage)
        return;
      const localValue = tryStorageValue(event.newValue);
      setStorageValue(localValue);
    };

    window.addEventListener("storage", updateLocalStorage);
    return () => window.removeEventListener("storage", updateLocalStorage);
  }, [key]);

  const handleStorageChange = (value: Result) => {
    if (typeof value === "string") {
      setStorageValue(value);
      localStorage.setItem(key, value);
    } else {
      try {
        const parsedValue = JSON.stringify(value);
        setStorageValue(value);
        localStorage.setItem(key, parsedValue);
      } catch (error) {
        console.error(
          "Error when try set item to localStorage:",
          error,
          +"\n",
          `localStorage key: ${key}`,
          +"\n",
          "NewValue:",
          value,
        );
      }
    }
  };

  return [storageValue, handleStorageChange] as [
    Result,
    (value: Result) => void,
  ];
};
