'use client';

import * as React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { ChatMessage } from './ChatMessage';
import { ChatTypingIndicator } from './ChatTypingIndicator';
import type { Message } from './types';

/**
 * Props interface for the ChatMessageList component
 */
export interface ChatMessageListProps {
  /**
   * Array of messages to display
   */
  messages: Message[];

  /**
   * If true, shows typing indicator
   */
  isTyping?: boolean;

  /**
   * If true, enables code highlighting
   */
  enableCodeHighlighting?: boolean;

  /**
   * If true, enables markdown formatting
   */
  enableMarkdown?: boolean;

  /**
   * Custom empty state message
   */
  emptyStateMessage?: string;
}

const MessageListContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  scrollBehavior: 'smooth',
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  height: '100%',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  gap: theme.spacing(2),
}));

/**
 * Hook for automatic scrolling of messages
 *
 * @param messages - The array of chat messages
 * @param isTyping - Boolean indicating if a typing indicator is showing
 * @param deps - Additional dependencies for the effect
 * @returns Object with refs for the message list and end anchor element
 */
const useChatScroll = (
  messages: Message[],
  isTyping: boolean,
  deps: any[] = []
): { endRef: React.RefObject<HTMLDivElement | null>; listRef: React.RefObject<HTMLDivElement | null> } => {
  const endRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Store previous scroll position info
  const [scrollInfo, setScrollInfo] = React.useState({
    scrollHeight: 0,
    scrollTop: 0,
    clientHeight: 0,
  });

  React.useEffect(() => {
    if (!listRef.current) return;

    // Get current values
    const { scrollHeight, scrollTop, clientHeight } = listRef.current;

    // Calculate if we were at the bottom before update
    const wasAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    // If at bottom or typing indicator appears, scroll to bottom
    if (wasAtBottom || isTyping) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    // Save current scroll info for next update
    setScrollInfo({
      scrollHeight,
      scrollTop,
      clientHeight,
    });

  }, [messages, isTyping, ...deps]);

  return { endRef, listRef };
};

/**
 * ChatMessageList displays a scrollable list of chat messages with automatic scrolling
 *
 * @component
 */
export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isTyping = false,
  enableCodeHighlighting = true,
  enableMarkdown = true,
  emptyStateMessage = "Send a message to start chatting",
}) => {
  const { endRef, listRef } = useChatScroll(messages, isTyping);

  // If there are no messages, show the empty state
  if (messages.length === 0) {
    return (
      <MessageListContainer ref={listRef}>
        <EmptyStateContainer>
          <Typography variant="body1">{emptyStateMessage}</Typography>
        </EmptyStateContainer>
      </MessageListContainer>
    );
  }

  return (
    <MessageListContainer ref={listRef}>
      {messages
        .filter((message) => message.role === 'user' || message.role === 'assistant')
        .map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            role={message.role as 'user' | 'assistant'} // Assert type after filtering
            timestamp={message.timestamp}
            model={message.model}
            status={message.status}
            // Pass attachments if they exist in the message
            attachments={message.attachments}
            // Pass the formatting props
            enableCodeHighlighting={enableCodeHighlighting}
            enableMarkdown={enableMarkdown}
          />
        ))}

      {isTyping && <ChatTypingIndicator />}

      {/* This invisible element is used for scrolling to the bottom */}
      <div ref={endRef} style={{ float: 'left', clear: 'both' }} />
    </MessageListContainer>
  );
};

ChatMessageList.displayName = 'ChatMessageList';

export default ChatMessageList;
