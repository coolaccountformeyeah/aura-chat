import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Shield, 
  MessageSquare, 
  Zap,
  ArrowRight,
  Lock,
  Users
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Create Characters',
    description: 'Design unique AI personalities with custom prompts and avatars.',
  },
  {
    icon: Shield,
    title: '100% Private',
    description: 'Your API key and conversations never leave your browser.',
  },
  {
    icon: Zap,
    title: 'Instant Chat',
    description: 'Real-time streaming responses powered by Google Gemini.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background gradient */}
      <div className="pointer-events-none absolute inset-0 gradient-hero" />
      <motion.div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] gradient-radial opacity-50"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative container mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          {/* Privacy badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm backdrop-blur-sm">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Your API key never leaves your browser</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Create a character.
            <br />
            <span className="text-primary glow-text">Chat instantly.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl max-w-2xl mx-auto"
          >
            Build AI personalities and have engaging conversations. 
            100% client-side, powered by your OpenRouter API key.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/character/new">
              <Button size="lg" className="group glow hover:glow text-base px-8 py-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Create Character
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="text-base px-8 py-6">
                <Users className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-32 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/50"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                
                {/* Hover glow effect */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-32 text-center"
        >
          <p className="mb-4 text-muted-foreground">
            Need an API key? Get one from{' '}
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              OpenRouter
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
