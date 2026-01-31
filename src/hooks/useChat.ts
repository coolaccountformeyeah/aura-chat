import { useState, useCallback, useRef } from 'react';
import { Message, Character } from '@/types/character';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-3-flash-preview';

interface UseChatOptions {
  character: Character;
  apiKey: string;
}

export function useChat({ character, apiKey }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const buildSystemPrompt = useCallback(() => {
    let systemPrompt = '';
    
    if (character.systemPrompt) {
      systemPrompt = character.systemPrompt;
    } else {
      systemPrompt = `You are ${character.name}. ${character.description}`;
      if (character.personality) {
        systemPrompt += `\n\nPersonality: ${character.personality}`;
      }
    }
    
    return systemPrompt;
  }, [character]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Create placeholder for assistant message
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'CharacterChat',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: content.trim() },
          ],
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                setMessages(prev => 
                  prev.map(m => 
                    m.id === assistantMessage.id 
                      ? { ...m, content: fullContent }
                      : m
                  )
                );
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      // Finalize the message
      setMessages(prev => 
        prev.map(m => 
          m.id === assistantMessage.id 
            ? { ...m, content: fullContent, timestamp: Date.now() }
            : m
        )
      );

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User cancelled - remove the empty assistant message
        setMessages(prev => prev.filter(m => m.id !== assistantMessage.id));
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        // Remove the empty assistant message on error
        setMessages(prev => prev.filter(m => m.id !== assistantMessage.id));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [apiKey, buildSystemPrompt, isLoading, messages]);

  const regenerateLastResponse = useCallback(async () => {
    if (messages.length < 2 || isLoading) return;

    // Find the last user message (loop backwards for ES2022 compat)
    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMessageIndex = i;
        break;
      }
    }
    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = messages[lastUserMessageIndex];
    
    // Remove all messages after (and including) the last assistant response
    setMessages(prev => prev.slice(0, lastUserMessageIndex));
    
    // Re-send the last user message
    setTimeout(() => {
      sendMessage(lastUserMessage.content);
    }, 100);
  }, [messages, isLoading, sendMessage]);

  const clearMessages = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    regenerateLastResponse,
    clearMessages,
    cancelGeneration,
  };
}
