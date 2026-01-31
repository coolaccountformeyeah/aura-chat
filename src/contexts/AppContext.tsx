import React, { createContext, useContext, ReactNode } from 'react';
import { useCharacters } from '@/hooks/useCharacters';
import { useApiKey } from '@/hooks/useApiKey';
import { Character } from '@/types/character';

interface AppContextType {
  // Characters
  characters: Character[];
  isCharactersLoaded: boolean;
  addCharacter: (character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => Character;
  updateCharacter: (id: string, updates: Partial<Omit<Character, 'id' | 'createdAt'>>) => void;
  deleteCharacter: (id: string) => void;
  getCharacter: (id: string) => Character | undefined;
  exportCharacters: (characterIds?: string[]) => void;
  importCharacters: (jsonData: string) => { success: boolean; count: number; error?: string };
  
  // API Key
  apiKey: string | null;
  hasApiKey: boolean;
  maskedKey: string | null;
  isApiKeyLoaded: boolean;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  testApiKey: (keyToTest?: string) => Promise<{ valid: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const {
    characters,
    isLoaded: isCharactersLoaded,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacter,
    exportCharacters,
    importCharacters,
  } = useCharacters();

  const {
    apiKey,
    hasApiKey,
    maskedKey,
    isLoaded: isApiKeyLoaded,
    setApiKey,
    clearApiKey,
    testApiKey,
  } = useApiKey();

  return (
    <AppContext.Provider
      value={{
        characters,
        isCharactersLoaded,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        getCharacter,
        exportCharacters,
        importCharacters,
        apiKey,
        hasApiKey,
        maskedKey,
        isApiKeyLoaded,
        setApiKey,
        clearApiKey,
        testApiKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
