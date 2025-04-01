'use client';

import * as React from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  styled,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Send,
  AttachFile,
  MoreVert,
  AutoAwesome,
  Person,
  SmartToy,
} from '@mui/icons-material';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  model?: string;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatProps {
  /**
   * Array of messages
   */
  messages: Message[];

  /**
   * Currently selected model
   */
  model?: string;

  /**
   * If true, shows typing indicator
   */
  isTyping?: boolean;

  /**
   * Callback when a message is sent
   */
  onSendMessage?: (content: string) => Promise<void>;

  /**
   * Callback when file is uploaded
   */
  onFileUpload?: (file: File) => Promise<void>;

  /**
   * Custom className
   */
  className?: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  maxWidth: '80%',
  wordBreak: 'break-word',
}));

const UserMessage = styled(MessageContainer)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  marginLeft: 'auto',
}));

const AssistantMessage = styled(MessageContainer)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
  marginRight: 'auto',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1, 2),
  },
}));

export const Chat = React.forwardRef<HTMLDivElement, ChatProps>(
  (
    {
      messages = [],
      model,
      isTyping = false,
      onSendMessage,
      onFileUpload,
      className,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme();
    const [input, setInput] = React.useState('');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
      scrollToBottom();
    }, [messages, isTyping]);

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

    const handleFileUpload = async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = event.target.files?.[0];
      if (file && onFileUpload) {
        try {
          await onFileUpload(file);
        } catch (error) {
          console.error('Failed to upload file:', error);
        }
      }
    };

    return (
      <StyledPaper ref={ref} className={className} elevation={0} {...props}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome color="primary" />
            <Typography variant="subtitle1" fontWeight={600}>
              AI Chat {model && `(${model})`}
            </Typography>
          </Box>
          <IconButton>
            <MoreVert />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                opacity: message.status === 'sending' ? 0.7 : 1,
              }}
            >
              <Avatar
                sx={{
                  bgcolor:
                    message.role === 'user'
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                }}
              >
                {message.role === 'user' ? <Person /> : <SmartToy />}
              </Avatar>
              {message.role === 'user' ? (
                <UserMessage>
                  <Typography>{message.content}</Typography>
                </UserMessage>
              ) : (
                <AssistantMessage>
                  <Typography>{message.content}</Typography>
                  {message.model && (
                    <Typography variant="caption" color="text.secondary">
                      via {message.model}
                    </Typography>
                  )}
                </AssistantMessage>
              )}
            </Box>
          ))}
          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 6 }}>
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">
                AI is typing...
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <StyledTextField
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
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    size="small"
                  >
                    <AttachFile />
                  </IconButton>
                  <IconButton
                    onClick={handleSend}
                    disabled={!input.trim()}
                    color="primary"
                    size="small"
                  >
                    <Send />
                  </IconButton>
                </Box>
              ),
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </Box>
      </StyledPaper>
    );
  },
);

Chat.displayName = 'Chat';
