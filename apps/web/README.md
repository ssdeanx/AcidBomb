# DeanMachines Web Frontend

## Current Progress (Sprint 1)

### Database & Authentication
- ✅ Supabase SSR auth implementation
- ✅ Client-side database hooks
- ✅ Protected route middleware
- ✅ Token management
- ✅ Environment configuration

### Mastra Integration
- ✅ Basic folder structure setup
- ✅ useAgent hook implementation
- ✅ Database integration hooks
- ⏳ Streaming response handling
- ⏳ Conversation state management

## Current Sprint Tasks (Sprint 2)

### Core Features
1. **Chat Interface**
   - Real-time streaming messages
   - Code block highlighting
   - Markdown support
   - File attachments
   - Voice input/output

2. **State Management**
   - Conversation persistence
   - User preferences
   - Authentication state
   - Error handling
   - Loading states

3. **Database Integration**
   - Conversation syncing
   - User settings persistence
   - Real-time updates
   - Offline support
   - Error recovery

4. **Authentication Flow**
   - SSR authentication
   - Token refresh
   - Session management
   - Protected routes
   - Error handling

## Future Development Plans

### Sprint 3: Advanced Features
1. **Enhanced UI/UX**
   - Rich text editor
   - File attachments
   - Image generation display
   - Voice input/output

2. **Conversation Features**
   - Thread branching
   - Context switching
   - History search
   - Favorite messages

3. **Integration Features**
   - Document upload
   - Web search results
   - Code execution
   - External tool integration

### Sprint 4: Performance & UX
1. **Performance**
   - Component lazy loading
   - State optimization
   - Cache management
   - Bundle size optimization

2. **User Experience**
   - Offline support
   - Progressive loading
   - Error boundaries
   - Analytics integration

## Project Structure
```
apps/web/
├── app/
│   ├── auth/              # Auth confirmation routes
│   ├── login/            # Login/signup pages
│   ├── private/          # Protected routes
│   ├── utils/
│   │   ├── supabase/    # Supabase client/server utils
│   │   └── database/    # Database hooks
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── src/
│   ├── mastra/
│   │   ├── agents/      # Agent type definitions
│   │   ├── hooks/       # React hooks for Mastra
│   │   ├── tools/       # Frontend utility tools
│   │   ├── workflows/   # Complex operation flows
│   │   └── index.ts     # Main Mastra configuration
│   └── hooks/           # Custom React hooks
└── package.json
```

## Database Integration

### Supabase Tables
- `user_preferences`: User settings and preferences
- `conversations`: Chat session tracking
- `messages`: Message history and content

### Client-Side Hooks
```typescript
// Database hooks example
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { usePreferences } from '@/hooks/usePreferences';

// Usage in components
const { conversations, isLoading } = useConversations();
const { messages, sendMessage } = useMessages(conversationId);
const { preferences, updatePreferences } = usePreferences();
```

## Environment Setup
```bash
# Required environment variables
NEXT_PUBLIC_SUPABASE_URL=<supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase_anon_key>

# Optional environment variables
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3000
```

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy `.env.example` to `.env.local` and configure:
   ```bash
   cp .env.example .env.local
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3001](http://localhost:3001)

## Features

### Authentication
- Email/Password authentication
- Protected routes
- Session management
- SSR authentication
- Token refresh

### Real-Time Chat
- Message streaming
- Code highlighting
- Markdown rendering
- File attachments
- Voice messages

### Database Features
- Conversation history
- User preferences
- Real-time updates
- Offline support
- Error recovery

## Development Guidelines

### State Management
- Use React Query for server state
- Use Zustand for client state
- Implement optimistic updates
- Handle loading states
- Manage error boundaries

### Database Access
- Use type-safe queries
- Implement error handling
- Add retry mechanisms
- Cache responses
- Handle offline mode

### Testing Strategy
- Jest for unit tests
- React Testing Library
- Playwright for E2E
- MSW for API mocking
- Storybook for components

## Progress Tracking

### Completed
- Supabase SSR auth
- Protected routes
- Database schema
- Basic chat UI
- Real-time updates

### In Progress
- Streaming messages
- File attachments
- Voice interface
- Offline support
- Error handling

### Coming Soon
- Advanced chat features
- Multi-agent support
- Mobile optimization
- Analytics integration
- Performance monitoring
