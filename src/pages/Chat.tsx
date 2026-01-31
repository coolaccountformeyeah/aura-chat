import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  RefreshCw, 
  Trash2, 
  Loader2,
  AlertCircle,
  StopCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/contexts/AppContext';
import { useChat } from '@/hooks/useChat';
import { CharacterAvatar } from '@/components/character/CharacterAvatar';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { TypingIndicator } from '@/components/chat/TypingIndicator';

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCharacter, apiKey, hasApiKey } = useApp();
  
  const character = id ? getCharacter(id) : null;
  
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Redirect if no character or no API key
  useEffect(() => {
    if (!character) {
      navigate('/dashboard');
    } else if (!hasApiKey) {
      navigate('/settings');
    }
  }, [character, hasApiKey, navigate]);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    regenerateLastResponse,
    clearMessages,
    cancelGeneration,
  } = useChat({
    character: character!,
    apiKey: apiKey!,
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage(input);
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!character) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <CharacterAvatar character={character} size="md" />
        
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">{character.name}</h2>
          <p className="text-sm text-muted-foreground truncate">
            {character.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={regenerateLastResponse}
                disabled={isLoading || messages.length < 2}
                title="Regenerate last response"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMessages}
                disabled={isLoading}
                title="Clear conversation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1" ref={scrollRef as any}>
        <div className="container mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <CharacterAvatar character={character} size="xl" className="mb-6" />
              <h3 className="text-xl font-semibold mb-2">Chat with {character.name}</h3>
              <p className="text-muted-foreground max-w-md">
                Start a conversation! Your messages are processed directly 
                through OpenRouter and are never stored.
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  character={character}
                />
              ))}
            </AnimatePresence>
          )}

          {/* Typing Indicator */}
          {isLoading && messages[messages.length - 1]?.content === '' && (
            <TypingIndicator character={character} />
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t border-border bg-background/80 backdrop-blur-xl px-4 py-4"
      >
        <form onSubmit={handleSubmit} className="container mx-auto max-w-3xl">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${character.name}...`}
                className="min-h-[44px] max-h-[150px] resize-none pr-12"
                disabled={isLoading}
                rows={1}
              />
            </div>
            
            {isLoading ? (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={cancelGeneration}
                className="h-11 w-11 shrink-0"
              >
                <StopCircle className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="h-11 w-11 shrink-0 glow"
              >
                <Send className="h-5 w-5" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Powered by Google Gemini via OpenRouter • Messages are session-only
          </p>
        </form>
      </motion.div>
    </div>
  );
}
