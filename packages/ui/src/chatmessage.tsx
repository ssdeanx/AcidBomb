'use client';

import * as React from 'react';
import {
  Box,
  Avatar,
  Typography,
  CircularProgress,
  styled,
  alpha,
} from '@mui/material';
import { Person, SmartToy } from '@mui/icons-material';

export interface ChatMessageProps {
  /**
   * Message content
   */
  content: string;

  /**
   * Message sender role
   */
  role: 'user' | 'assistant';

  /**
   * Message timestamp
   */
  timestamp: Date;

  /**
   * Model used for response (for assistant messages)
   */
  model?: string;

  /**
   * Message status
   */
  status?: 'sending' | 'sent' | 'error';
}

const MessageContainer = styled(Box)<{ status?: ChatMessageProps['status'] }>(
  ({ theme, status }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    opacity: status === 'sending' ? 0.7 : 1,
  })
);

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  backgroundColor: isUser
    ? alpha(theme.palette.primary.main, 0.1)
    : alpha(theme.palette.secondary.main, 0.1),
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2),
  maxWidth: '80%',
  position: 'relative',
}));

const ModelBadge = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({
    content,
    role,
    timestamp,
    model,
    status = 'sent',
    ...props
  }, ref) => {
    const isUser = role === 'user';

    return (
      <MessageContainer ref={ref} status={status} {...props}>
        <Avatar sx={{
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
        }}>
          {isUser ? <Person /> : <SmartToy />}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <MessageBubble isUser={isUser}>
            <Typography variant="body1">
              {content}
            </Typography>

            {status === 'sending' && (
              <CircularProgress
                size={16}
                sx={{
                  position: 'absolute',
                  right: -24,
                  top: '50%',
                  marginTop: -1,
                }}
              />
            )}

            {model && (
              <ModelBadge>
                via {model}
              </ModelBadge>
            )}
          </MessageBubble>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: 'block' }}
          >
            {new Date(timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
      </MessageContainer>
    );
  }
);

ChatMessage.displayName = 'ChatMessage';
