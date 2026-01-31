
# CharacterChat – Client-Side AI Character Chat App

A production-grade, privacy-first character chat application inspired by Character.AI. 100% client-side with direct OpenRouter API integration.

---

## 🎨 Design System

**Theme**: Dark mode exclusively with deep blacks (#0a0a0a), charcoal backgrounds (#1a1a1a), and electric blue accents (#3b82f6 to #60a5fa gradients)

**Aesthetic**: Startup-quality polish inspired by Character.AI, Vercel, Linear, and Raycast

**Animations**: Framer Motion for smooth page transitions, hover effects, staggered lists, and chat message animations

---

## 📄 Pages & Features

### 1. Landing Page
- Premium hero section with animated gradient background
- Tagline: "Create a character. Chat instantly. Fully client-side."
- Privacy badge highlighting "Your API key never leaves your browser"
- Animated CTA button → Create Character
- Feature highlights with animated icons

### 2. Character Dashboard
- Grid/list view of all created characters with animated cards
- Character cards showing avatar, name, description preview
- Quick actions: Edit, Delete, Start Chat, Export
- Import character button (JSON upload)
- Search/filter characters
- Empty state with prompt to create first character

### 3. Character Creation/Edit
- Multi-step or single-page form with animated inputs
- Fields: Name, Description, Personality, System Prompt, Avatar
- Avatar options: Select from preset icons or paste image URL
- Live preview card showing how character will appear
- Save to localStorage with validation

### 4. API Key Setup
- Dedicated settings section (accessible from nav)
- Masked input field for OpenRouter API key
- Clear privacy messaging: "Stored locally, never transmitted"
- Test connection button to validate key
- Easy update/clear functionality

### 5. Chat Interface
- **Left sidebar**: Character info panel (avatar, name, description)
- **Center**: Chat conversation area
- Message bubbles with user/bot styling
- Animated typing indicator while model responds
- Message fade/slide-in animations on arrival
- Regenerate last response button
- Clear conversation button
- Smooth auto-scroll to newest messages
- Character's system prompt passed to OpenRouter API

---

## 🔐 Privacy & Storage

- OpenRouter API key stored in localStorage only
- Character configurations saved in localStorage
- Chat history kept in memory (cleared on page refresh)
- Export characters as JSON for backup/transfer
- Import JSON to restore characters
- Zero external tracking or analytics

---

## ⚡ Technical Approach

- Direct OpenRouter API calls from browser using `google/gemini-3-flash-preview`
- Streaming responses for real-time chat feel
- React with hooks and clean component architecture
- Framer Motion for all animations
- Mobile-responsive design throughout
- Graceful error handling for missing/invalid API keys and API errors

---

## 🗺 Navigation Flow

```
Landing → [Create Character] → Character Form → Dashboard
                                                    ↓
Dashboard → [Select Character] → Chat Interface
                ↓
         [Settings] → API Key Setup
```

This delivers a polished, Character.AI-inspired experience that's 100% private and runs entirely in your browser!
