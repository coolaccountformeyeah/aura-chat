import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="border-t border-border bg-background/50 py-6"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>100% Client-Side • Your data stays on your device</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Privacy First</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Powered by OpenRouter
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
