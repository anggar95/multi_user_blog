import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface AutoSaveOptions {
  delay?: number;
  onSave?: (data: any) => Promise<void>;
}

export function useAutoSave<T>(initialData: T, options: AutoSaveOptions = {}) {
  const { delay = 1000, onSave } = options;
  const [data, setData] = useState<T>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const debouncedData = useDebounce(data, delay);

  const save = useCallback(async (dataToSave: T) => {
    if (!onSave) return;

    setIsSaving(true);
    setError(null);

    try {
      await onSave(dataToSave);
      setLastSaved(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save'));
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  useEffect(() => {
    if (debouncedData !== initialData) {
      save(debouncedData);
    }
  }, [debouncedData, initialData, save]);

  return {
    data,
    setData,
    isSaving,
    lastSaved,
    error,
  };
} 