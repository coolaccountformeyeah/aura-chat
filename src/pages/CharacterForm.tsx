import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { CharacterAvatar } from '@/components/character/CharacterAvatar';
import { AvatarPicker } from '@/components/character/AvatarPicker';
import { AVATAR_ICONS } from '@/types/character';

const characterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
  personality: z.string().max(1000, 'Personality is too long').optional(),
  systemPrompt: z.string().max(2000, 'System prompt is too long').optional(),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  avatarIcon: z.string().optional(),
});

type CharacterFormData = z.infer<typeof characterSchema>;

export default function CharacterForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCharacter, addCharacter, updateCharacter } = useApp();
  
  const isEditing = id && id !== 'new';
  const existingCharacter = isEditing ? getCharacter(id) : null;
  
  const [showPreview, setShowPreview] = useState(true);

  const form = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: existingCharacter?.name || '',
      description: existingCharacter?.description || '',
      personality: existingCharacter?.personality || '',
      systemPrompt: existingCharacter?.systemPrompt || '',
      avatarUrl: existingCharacter?.avatarUrl || '',
      avatarIcon: existingCharacter?.avatarIcon || AVATAR_ICONS[0],
    },
  });

  const watchedValues = form.watch();

  const onSubmit = (data: CharacterFormData) => {
    try {
      if (isEditing && existingCharacter) {
        updateCharacter(existingCharacter.id, {
          name: data.name,
          description: data.description,
          personality: data.personality || '',
          systemPrompt: data.systemPrompt || '',
          avatarUrl: data.avatarUrl || undefined,
          avatarIcon: data.avatarIcon,
        });
        toast({
          title: 'Character updated',
          description: `"${data.name}" has been saved.`,
        });
      } else {
        addCharacter({
          name: data.name,
          description: data.description,
          personality: data.personality || '',
          systemPrompt: data.systemPrompt || '',
          avatarUrl: data.avatarUrl || undefined,
          avatarIcon: data.avatarIcon,
        });
        toast({
          title: 'Character created',
          description: `"${data.name}" is ready to chat!`,
        });
      }
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save character. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Create preview character object
  const previewCharacter = {
    id: 'preview',
    name: watchedValues.name || 'Character Name',
    description: watchedValues.description || 'Character description will appear here...',
    personality: watchedValues.personality || '',
    systemPrompt: watchedValues.systemPrompt || '',
    avatarUrl: watchedValues.avatarUrl,
    avatarIcon: watchedValues.avatarIcon,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Edit Character' : 'Create Character'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update your character\'s details.' : 'Design a unique AI personality.'}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info Card */}
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Luna the Wise Wizard"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief description of your character..."
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe who your character is in a few sentences.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Avatar Card */}
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Avatar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="avatarIcon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose an Icon</FormLabel>
                        <FormControl>
                          <AvatarPicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Or use an Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/avatar.png"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Paste a direct link to an image (overrides icon).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Personality Card */}
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Personality & Behavior</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="personality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personality Traits</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe personality traits, quirks, speech patterns..."
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          How should this character act and respond?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="systemPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Prompt (Advanced)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Custom instructions for the AI model..."
                            className="min-h-[120px] resize-none font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Override the default prompt. Leave empty to auto-generate from name, description, and personality.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex gap-4">
                <Button type="submit" className="glow" size="lg">
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Save Changes' : 'Create Character'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Preview</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {showPreview && (
              <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <CharacterAvatar character={previewCharacter} size="xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {previewCharacter.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {previewCharacter.description}
                  </p>
                  {previewCharacter.personality && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        {previewCharacter.personality}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
