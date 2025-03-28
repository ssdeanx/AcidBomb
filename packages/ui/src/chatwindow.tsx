'use client';

import * as React from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Divider,
  styled,
  alpha,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Send,
  AttachFile,
  Settings,
  AutoAwesome,
  MoreVert,
  RestartAlt,
  Save,
  ContentCopy,
  Download,
  Upload,
  Delete,
  Storage,
  Image,
  AudioFile,
  PictureAsPdf,
} from '@mui/icons-material';
import { chatMessage as ChatMessage } from './chatmessage';
import { modelSelector as ModelSelector } from './model_selector';
import type { ModelOption } from './model_selector';

// Add new interface for chat settings
interface ChatSettings {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  systemPrompt?: string;
}

// Extend ChatWindowProps
export interface ChatWindowProps {
  /**
   * Chat messages
   */
  messages: Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    model?: string;
    status?: 'sending' | 'sent' | 'error';
  }>;

  /**
   * Available models
   */
  models: ModelOption[];

  /**
   * Currently selected model
   */
  selectedModel?: string;

  /**
   * Callback when a message is sent
   */
  onSendMessage?: (content: string) => Promise<void>;

  /**
   * Callback when model is changed
   */
  onModelChange?: (modelId: string) => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Current chat settings
   */
  settings?: ChatSettings;

  /**
   * Callback when settings are changed
   */
  onSettingsChange?: (settings: ChatSettings) => void;

  /**
   * Maximum file size in bytes
   * @default 10485760 (10MB)
   */
  maxFileSize?: number;

  /**
   * Allowed file types
   * @default ['image/*', 'application/pdf', 'audio/*']
   */
  allowedFileTypes?: string[];

  /**
   * If true, enables code highlighting
   * @default true
   */
  enableCodeHighlighting?: boolean;

  /**
   * If true, enables markdown formatting
   * @default true
   */
  enableMarkdown?: boolean;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '600px',
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
}));

const ChatContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
}));

// Add new styled components
const StyledFilePreview = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: theme.shape.borderRadius,
  alignItems: 'center',
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export const chatWindow = React.forwardRef<HTMLDivElement, ChatWindowProps>(
  ({
    messages = [],
    models = [],
    selectedModel,
    onSendMessage,
    onModelChange,
    settings = {},
    onSettingsChange,
    maxFileSize = 10 * 1024 * 1024, // 10MB
    allowedFileTypes = ['image/*', 'application/pdf', 'audio/*'],
    enableCodeHighlighting = true,
    enableMarkdown = true,
    className,
    ...props
  }, ref) => {
    const [input, setInput] = React.useState('');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
      if (!input.trim()) return;

      try {
        await onSendMessage?.(input);
        setInput('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    };

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const validFiles = files.filter(file => {
        const isValidType = allowedFileTypes.some(type => {
          // Add type check and provide default value
          const [category = '', ext = ''] = type.split('/');
          return ext === '*' ? file.type.startsWith(category) : file.type === type;
        });
        const isValidSize = file.size <= maxFileSize;
        return isValidType && isValidSize;
      });
      setSelectedFiles(prev => [...prev, ...validFiles]);
    };

    // Handle file removal
    const handleFileRemove = (index: number) => {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Handle menu actions
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleClearChat = () => {
      // Implement chat clearing logic
      handleMenuClose();
    };

    const handleExportChat = () => {
      const chatData = {
        messages,
        settings,
        timestamp: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      handleMenuClose();
    };

    // Settings dialog content
    const renderSettingsDialog = () => (
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Chat Settings</DialogTitle>
        <DialogContent>
          {/* Add settings controls */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            onSettingsChange?.(settings);
            setSettingsOpen(false);
          }} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );

    // File preview list
    const renderFilePreview = () => (
      <List dense>
        {selectedFiles.map((file, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleFileRemove(index)}>
                <Delete />
              </IconButton>
            }
          >
            <ListItemIcon>
              {file.type.startsWith('image/') ? <Image /> :
               file.type === 'application/pdf' ? <PictureAsPdf /> :
               file.type.startsWith('audio/') ? <AudioFile /> :
               <Storage />}
            </ListItemIcon>
            <ListItemText
              primary={file.name}
              secondary={`${(file.size / 1024).toFixed(1)} KB`}
            />
          </ListItem>
        ))}
      </List>
    );

    return (
      <StyledPaper ref={ref} className={className} elevation={0} {...props}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <AutoAwesome color="primary" />
          <Typography variant="h6" sx={{ flex: 1 }}>
            AI Chat
          </Typography>
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onModelChange={onModelChange}
            showDetails
          />
          <Tooltip title="Settings">
            <IconButton onClick={() => setSettingsOpen(true)}>
              <Settings />
            </IconButton>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleClearChat}>
            <ListItemIcon><RestartAlt /></ListItemIcon>
            Clear chat
          </MenuItem>
          <MenuItem onClick={handleExportChat}>
            <ListItemIcon><Download /></ListItemIcon>
            Export chat
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><ContentCopy /></ListItemIcon>
            Copy all
          </MenuItem>
        </Menu>

        <Divider />

        <ChatContainer>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
              model={message.model}
              status={message.status}
            />
          ))}
          <div ref={messagesEndRef} />
        </ChatContainer>

        <Divider />

        {selectedFiles.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            {renderFilePreview()}
          </Box>
        )}

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            variant="outlined"
            InputProps={{
              endAdornment: (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    multiple
                    accept={allowedFileTypes.join(',')}
                    onChange={handleFileSelect}
                  />
                  <Tooltip title="Attach files">
                    <IconButton onClick={() => fileInputRef.current?.click()}>
                      <AttachFile />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    onClick={handleSend}
                    disabled={!input.trim() && selectedFiles.length === 0}
                    color="primary"
                  >
                    {isTyping ? <CircularProgress size={24} /> : <Send />}
                  </IconButton>
                </Box>
              ),
            }}
          />
        </Box>

        {renderSettingsDialog()}
      </StyledPaper>
    );
  }
);

chatWindow.displayName = 'chatWindow';
