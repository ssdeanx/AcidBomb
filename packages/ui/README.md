# @repo/ui

A modern React component library built with Material-UI v7 and TypeScript, designed for AI/ML dashboards and analytics applications.

## Components

### Core Components

- ✅ `button` - Advanced button with multiple variants and states
- ✅ `card` - Versatile card component with various styles
- ✅ `input` - Enhanced text input with multiple features
- ✅ `paper` - Customizable surface component
- ✅ `progress` - Progress indicators (linear, circular, dots)
- ✅ `switch` - Toggle switch with label support
- ✅ `collapsible` - Expandable/collapsible content sections
- ✅ `label` - Accessible form label with helper text and error states
- ✅ `popover` - Enhanced popover with arrow and positioning options
- ✅ `scrollarea` - Custom scrollable container with styled scrollbars
- ✅ `dropdown` - Feature-rich dropdown menu with nested items

### Layout Components

- ✅ `appbar` - Top navigation bar
- ✅ `sidebar` - Collapsible navigation sidebar
- ✅ `footer` - Responsive footer with social links
- ✅ `hero` - Landing page hero section
- ✅ `form` - Comprehensive form with React Hook Form integration

### Data Display Components

- ✅ `charts` (using Recharts)
  - Line charts
  - Bar charts
  - Area charts
  - Pie charts
- ✅ `graphs` (using Plotly)
  - Line plots
  - Bar plots
  - Scatter plots
  - Heatmaps
  - Candlestick charts
- ✅ `table` - Data table with sorting and pagination

### Dashboard Components

- ✅ `dashboard` - Main dashboard layout
- ✅ `chatwindow` - AI chat interface
- ✅ `chatmessage` - Individual chat message component
- ✅ `model_selector` - LLM model selection dropdown

### Chat Components (NEW)

- ✅ `ChatContainer` - Main wrapper component for the modular chat interface
- ✅ `ChatHeader` - Component for title, model selection and settings
- ✅ `ChatMessageList` - Component for displaying messages with auto-scrolling
- ✅ `ChatMessage` - Enhanced individual message component with markdown and code highlighting
- ✅ `ChatInput` - Advanced input component with file attachments and voice input
- ✅ `ChatTypingIndicator` - Animated indicator for typing status
- ✅ `useChat` - Hook for chat operations with Mastra AI integration

## Required Packages

```bash
# Core dependencies
pnpm add uuid react-markdown react-syntax-highlighter emoji-mart

# For Markdown and code highlighting
pnpm add react-markdown react-syntax-highlighter rehype-raw remark-gfm

# For file handling
pnpm add browser-image-compression file-type-browser

# For voice features
pnpm add recordrtc @livekit/components-react

# For Mastra AI integration
pnpm add @mastra/client-js @mastra/core @mastra/rag

# For real-time features
pnpm add socket.io-client

# For types
pnpm add -D @types/uuid @types/react-syntax-highlighter

# For Pinecone, MCP and Upstash integration
pnpm add @mastra/mcp @mastra/pinecone @mastra/upstash

```

## Installation

```bash
pnpm add @repo/ui
```

## Usage

```bash
import { button as Button } from '@repo/ui/button';
import { dashboard as Dashboard } from '@repo/ui/dashboard';
import { charts as Charts } from '@repo/ui/charts';
import { graphs as Graphs } from '@repo/ui/graphs';
import { ChatContainer, ChatInput, useChat } from '@repo/ui/chat';
import { collapsible as Collapsible } from '@repo/ui/collapsible';
import { form as Form } from '@repo/ui/form';
import { label as Label } from '@repo/ui/label';
import { popover as Popover } from '@repo/ui/popover';
import { scrollarea as ScrollArea } from '@repo/ui/ScrollArea';
import { dropdown as Dropdown } from '@repo/ui/dropdrown';
```

## Todos

- [x] Add modular chat components
- [x] Add Mastra AI integration
- [x] Add markdown and code highlighting support
- [ ] Improve documentation
- [ ] Fix bugs and issues
- [ ] Optimize performance
- [x] Add more themes and styles
- [ ] Improve accessibility
