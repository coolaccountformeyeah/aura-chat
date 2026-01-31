export interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
  systemPrompt: string;
  avatarUrl?: string;
  avatarIcon?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatState {
  characterId: string;
  messages: Message[];
  isLoading: boolean;
}

export const AVATAR_ICONS = [
  '🤖', '🧙‍♂️', '🦊', '🐉', '👻', '🎭', '🦸‍♀️', '🧛', 
  '🧜‍♀️', '🦹', '🧚', '👽', '🤴', '👸', '🧞', '🦄'
] as const;

export type AvatarIcon = typeof AVATAR_ICONS[number];
