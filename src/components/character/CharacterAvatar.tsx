import { motion } from 'framer-motion';
import { Character, AVATAR_ICONS } from '@/types/character';
import { cn } from '@/lib/utils';

interface CharacterAvatarProps {
  character: Character;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-lg',
  md: 'h-10 w-10 text-xl',
  lg: 'h-12 w-12 text-2xl',
  xl: 'h-16 w-16 text-3xl',
};

export function CharacterAvatar({ character, size = 'md', className }: CharacterAvatarProps) {
  const hasImage = character.avatarUrl && character.avatarUrl.trim() !== '';
  const hasIcon = character.avatarIcon && AVATAR_ICONS.includes(character.avatarIcon as any);
  
  // Generate a consistent color based on character name
  const colorIndex = character.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 6;
  const bgColors = [
    'bg-primary/20',
    'bg-blue-500/20',
    'bg-purple-500/20',
    'bg-green-500/20',
    'bg-orange-500/20',
    'bg-pink-500/20',
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "relative flex items-center justify-center rounded-full overflow-hidden shrink-0",
        sizeClasses[size],
        !hasImage && bgColors[colorIndex],
        className
      )}
    >
      {hasImage ? (
        <img
          src={character.avatarUrl}
          alt={character.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback to icon or initial on image error
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : hasIcon ? (
        <span>{character.avatarIcon}</span>
      ) : (
        <span className="font-semibold text-foreground">
          {character.name.charAt(0).toUpperCase()}
        </span>
      )}
    </motion.div>
  );
}
