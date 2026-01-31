import { motion } from 'framer-motion';
import { Message, Character } from '@/types/character';
import { CharacterAvatar } from '@/components/character/CharacterAvatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  character: Character;
}

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' as const }
  },
  exit: { opacity: 0, scale: 0.95 },
};

export function ChatMessage({ message, character }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <CharacterAvatar character={character} size="sm" className="mt-1" />
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border border-border rounded-bl-md"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content || (
            <span className="text-muted-foreground italic">...</span>
          )}
        </p>
      </div>

      {/* User Avatar Placeholder */}
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-1">
          <span className="text-xs font-medium">You</span>
        </div>
      )}
    </motion.div>
  );
}
