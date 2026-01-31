import { useState, useEffect, useCallback } from 'react';
import { Character } from '@/types/character';

const STORAGE_KEY = 'characterchat_characters';

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load characters from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCharacters(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load characters:', error);
    }
    setIsLoaded(true);
  }, []);

  // Persist characters to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    }
  }, [characters, isLoaded]);

  const addCharacter = useCallback((character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCharacter: Character = {
      ...character,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCharacters(prev => [...prev, newCharacter]);
    return newCharacter;
  }, []);

  const updateCharacter = useCallback((id: string, updates: Partial<Omit<Character, 'id' | 'createdAt'>>) => {
    setCharacters(prev => 
      prev.map(char => 
        char.id === id 
          ? { ...char, ...updates, updatedAt: Date.now() }
          : char
      )
    );
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    setCharacters(prev => prev.filter(char => char.id !== id));
  }, []);

  const getCharacter = useCallback((id: string) => {
    return characters.find(char => char.id === id);
  }, [characters]);

  const exportCharacters = useCallback((characterIds?: string[]) => {
    const toExport = characterIds 
      ? characters.filter(c => characterIds.includes(c.id))
      : characters;
    
    const data = JSON.stringify(toExport, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `characterchat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [characters]);

  const importCharacters = useCallback((jsonData: string): { success: boolean; count: number; error?: string } => {
    try {
      const imported = JSON.parse(jsonData);
      const charactersArray = Array.isArray(imported) ? imported : [imported];
      
      // Validate structure
      const validCharacters: Character[] = charactersArray
        .filter((char: any) => 
          typeof char.name === 'string' && 
          typeof char.description === 'string'
        )
        .map((char: any) => ({
          id: crypto.randomUUID(), // Generate new IDs to avoid conflicts
          name: char.name,
          description: char.description,
          personality: char.personality || '',
          systemPrompt: char.systemPrompt || '',
          avatarUrl: char.avatarUrl,
          avatarIcon: char.avatarIcon,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }));

      if (validCharacters.length === 0) {
        return { success: false, count: 0, error: 'No valid characters found in the file' };
      }

      setCharacters(prev => [...prev, ...validCharacters]);
      return { success: true, count: validCharacters.length };
    } catch (error) {
      return { success: false, count: 0, error: 'Invalid JSON format' };
    }
  }, []);

  return {
    characters,
    isLoaded,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacter,
    exportCharacters,
    importCharacters,
  };
}
