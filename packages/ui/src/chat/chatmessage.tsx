'use client';

import * as React from 'react';
import {
  Box,
  Avatar,
  Typography,
  CircularProgress,
  styled,
  alpha,
  Link,
} from '@mui/material';
import { Person, SmartToy } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Attachment } from './types';

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

  /**
   * Optional array of attachment metadata
   */
  attachments?: Attachment[];

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

const AttachmentsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const AttachmentItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  border: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1),
}));

const StyledMarkdown = styled(Box)(({ theme }) => ({
  '& p': {
    margin: theme.spacing(0.5, 0),
  },
  '& a': {
    color: theme.palette.primary.main,
  },
  '& ul, & ol': {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(3),
  },
  '& code': {
    backgroundColor: alpha(theme.palette.text.primary, 0.1),
    padding: theme.spacing(0, 0.5),
    borderRadius: theme.shape.borderRadius,
    fontFamily: 'monospace',
  },
  '& pre': {
    margin: theme.spacing(1, 0),
    borderRadius: theme.shape.borderRadius,
    overflow: 'auto',
  },
  '& img': {
    maxWidth: '100%',
    borderRadius: theme.shape.borderRadius,
  },
  '& blockquote': {
    margin: theme.spacing(1, 0),
    padding: theme.spacing(0, 1),
    borderLeft: `4px solid ${theme.palette.divider}`,
    color: theme.palette.text.secondary,
  },
  '& table': {
    borderCollapse: 'collapse',
    width: '100%',
    margin: theme.spacing(1, 0),
  },
  '& th, & td': {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(0.5, 1),
    textAlign: 'left',
  },
  '& th': {
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
  },
}));

/**
 * Renders a chat message bubble with support for markdown, code highlighting, and file attachments
 */
export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({
    content,
    role,
    timestamp,
    model,
    status = 'sent',
    attachments = [],
    enableCodeHighlighting = true,
    enableMarkdown = true,
    ...props
  }, ref) => {
    const isUser = role === 'user';

    // Helper to get file type icon or thumbnail for attachments
    const getAttachmentDisplay = (attachment: Attachment) => {
      const { name, type, url } = attachment;

      // For image attachments with a URL, show a thumbnail
      if (type.startsWith('image/') && url) {
        return (
          <Box
            component="img"
            src={url}
            alt={name}
            sx={{
              maxHeight: 100,
              maxWidth: 200,
              objectFit: 'contain',
              borderRadius: 1,
            }}
          />
        );
      }

      // For other file types, show just the file name with link if URL exists
      return (
        <Typography variant="body2" component={url ? Link : 'span'} href={url || undefined} target="_blank">
          {name}
        </Typography>
      );
    };

    return (
      <MessageContainer ref={ref} status={status} {...props}>
        <Avatar sx={{
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
        }}>
          {isUser ? <Person /> : <SmartToy />}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <MessageBubble isUser={isUser}>
            {enableMarkdown ? (
              <StyledMarkdown>
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...rest }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match && enableCodeHighlighting ? (
                        <SyntaxHighlighter
                          style={materialDark}
                          language={match[1]}
                          PreTag="div"
                          {...rest} // Pass rest props if needed by SyntaxHighlighter, otherwise remove
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...rest}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </StyledMarkdown>
            ) : (
              <Typography variant="body1">{content}</Typography>
            )}

            {/* Display attachments if present */}
            {attachments && attachments.length > 0 && (
              <AttachmentsContainer>
                {attachments.map((attachment) => (
                  <AttachmentItem key={attachment.id}>
                    {getAttachmentDisplay(attachment)}
                    {attachment.size && (
                      <Typography variant="caption" color="text.secondary">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </Typography>
                    )}
                  </AttachmentItem>
                ))}
              </AttachmentsContainer>
            )}

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

export default ChatMessage;
