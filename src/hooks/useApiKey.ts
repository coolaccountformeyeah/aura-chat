import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'characterchat_openrouter_key';

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setApiKeyState(stored);
    } catch (error) {
      console.error('Failed to load API key:', error);
    }
    setIsLoaded(true);
  }, []);

  const setApiKey = useCallback((key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKeyState(key);
  }, []);

  const clearApiKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKeyState(null);
  }, []);

  const testApiKey = useCallback(async (keyToTest?: string): Promise<{ valid: boolean; error?: string }> => {
    const key = keyToTest || apiKey;
    if (!key) {
      return { valid: false, error: 'No API key provided' };
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      });

      if (response.ok) {
        return { valid: true };
      } else if (response.status === 401) {
        return { valid: false, error: 'Invalid API key' };
      } else {
        return { valid: false, error: `API error: ${response.status}` };
      }
    } catch (error) {
      return { valid: false, error: 'Network error - check your connection' };
    }
  }, [apiKey]);

  const hasApiKey = Boolean(apiKey);
  const maskedKey = apiKey ? `sk-or-...${apiKey.slice(-4)}` : null;

  return {
    apiKey,
    hasApiKey,
    maskedKey,
    isLoaded,
    setApiKey,
    clearApiKey,
    testApiKey,
  };
}
