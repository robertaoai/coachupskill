import { useState, useEffect } from 'react';

export function useSessionStorage(key: string) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('⏱️ useSessionStorage - Fallback timeout reached');
      setLoading(false);
    }, 150);

    // Check localStorage immediately
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      console.log('📦 useSessionStorage - Initial value:', stored);
      setValue(stored);
      setLoading(false);
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [key]);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        console.log('🔄 useSessionStorage - Storage changed:', e.newValue);
        setValue(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  const update = (newValue: string) => {
    console.log('💾 useSessionStorage - Updating:', newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, newValue);
      setValue(newValue);
    }
  };

  const clear = () => {
    console.log('🗑️ useSessionStorage - Clearing');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
      setValue(null);
    }
  };

  return { value, update, clear, loading };
}
