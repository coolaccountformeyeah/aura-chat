import { motion } from 'framer-motion';
import { AVATAR_ICONS } from '@/types/character';
import { cn } from '@/lib/utils';

interface AvatarPickerProps {
  value?: string;
  onChange: (value: string) => void;
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-2">
      {AVATAR_ICONS.map((icon) => (
        <motion.button
          key={icon}
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(icon)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors",
            value === icon
              ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          {icon}
        </motion.button>
      ))}
    </div>
  );
}
