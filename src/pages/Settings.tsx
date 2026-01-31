import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Loader2, 
  Shield, 
  Trash2,
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { apiKey, hasApiKey, maskedKey, setApiKey, clearApiKey, testApiKey } = useApp();
  const { toast } = useToast();
  
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'valid' | 'invalid' | null>(null);

  const handleSaveKey = async () => {
    if (!inputKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an API key.',
        variant: 'destructive',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await testApiKey(inputKey.trim());
    
    if (result.valid) {
      setApiKey(inputKey.trim());
      setInputKey('');
      setTestResult('valid');
      toast({
        title: 'API Key Saved',
        description: 'Your OpenRouter API key has been saved locally.',
      });
    } else {
      setTestResult('invalid');
      toast({
        title: 'Invalid API Key',
        description: result.error || 'Please check your API key and try again.',
        variant: 'destructive',
      });
    }

    setIsTesting(false);
  };

  const handleClearKey = () => {
    clearApiKey();
    setInputKey('');
    setTestResult(null);
    toast({
      title: 'API Key Removed',
      description: 'Your API key has been cleared from local storage.',
    });
  };

  const handleTestExisting = async () => {
    if (!apiKey) return;
    
    setIsTesting(true);
    setTestResult(null);

    const result = await testApiKey();
    setTestResult(result.valid ? 'valid' : 'invalid');
    
    toast({
      title: result.valid ? 'Connection Successful' : 'Connection Failed',
      description: result.valid 
        ? 'Your API key is working correctly.' 
        : result.error || 'Please check your API key.',
      variant: result.valid ? 'default' : 'destructive',
    });

    setIsTesting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your OpenRouter API key and preferences.
        </p>
      </motion.div>

      {/* API Key Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>OpenRouter API Key</CardTitle>
                <CardDescription>
                  Required for AI chat functionality
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Privacy Notice */}
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Your privacy is protected</p>
                <p className="text-sm text-muted-foreground">
                  Your API key is stored only in your browser's local storage. 
                  It never leaves your device and is never sent to our servers.
                </p>
              </div>
            </div>

            {/* Current Key Status */}
            {hasApiKey ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">API Key Configured</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {maskedKey}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestExisting}
                      disabled={isTesting}
                    >
                      {isTesting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Test'
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleClearKey}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {testResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 rounded-lg p-3 ${
                      testResult === 'valid' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {testResult === 'valid' ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span className="text-sm">Connection successful!</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        <span className="text-sm">Connection failed. Please check your key.</span>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showKey ? 'text' : 'password'}
                    placeholder="sk-or-v1-..."
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    className="pr-20 font-mono"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <Button
                  onClick={handleSaveKey}
                  disabled={!inputKey.trim() || isTesting}
                  className="w-full glow"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Save API Key
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Get API Key Link */}
            <div className="pt-4 border-t border-border">
              <a
                href="https://openrouter.ai/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Get an OpenRouter API key
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">About CharacterChat</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              CharacterChat is a 100% client-side application. All your data—including 
              characters and API keys—stays in your browser and is never sent to any server.
            </p>
            <p>
              Chat history is session-only and clears when you refresh or close the page.
              Characters are saved in your browser's local storage.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
