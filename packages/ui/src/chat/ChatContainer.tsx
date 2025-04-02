'use client';

import * as React from 'react';
import { Box, Paper, styled, alpha, useTheme } from '@mui/material';
import type { ChatSettings, Message } from './types';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';

/**
 * Props for the ChatContainer component
 */
export interface ChatContainerProps {
  /**
   * Array of chat messages
   */
  messages: Message[];

  /**
   * Current AI model being used
   */
  model?: string;

  /**
   * Available models for selection
   */
  availableModels?: Array<{
    id: string;
    name: string;
    description?: string;
    provider?: string;
  }>;

  /**
   * If true, shows typing indicator
   */
  isTyping?: boolean;

  /**
   * Callback when a message is sent
   */
  onSendMessage?: (content: string, attachments?: File[]) => Promise<void>;

  /**
   * Callback when model is changed
   */
  onModelChange?: (modelId: string) => void;

  /**
   * Callback when a file is uploaded
   */
  onFileUpload?: (files: File[]) => Promise<void>;

  /**
   * Current chat settings
   */
  settings?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    systemPrompt?: string;
  };

  /**
   * Callback when settings are changed
   */
  onSettingsChange?: (settings: ChatSettings) => void;

  /**
   * Custom className
   */
  className?: string;

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

  /**
   * Custom header title
   * @default "AI Chat"
   */
  title?: string;
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

/**
 * ChatContainer is the main wrapper component for the modular chat interface.
 * It composes smaller components to create a complete chat experience.
 */
export const ChatContainer = React.forwardRef<HTMLDivElement, ChatContainerProps>(
  (
    {
      messages = [],
      model,
      availableModels = [],
      isTyping = false,
      onSendMessage,
      onModelChange,
      onFileUpload,
      settings = {},
      onSettingsChange,
      maxFileSize = 10 * 1024 * 1024, // 10MB
      allowedFileTypes = ['image/*', 'application/pdf', 'audio/*'],
      enableCodeHighlighting = true,
      enableMarkdown = true,
      title = "AI Chat",
      className,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme();
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

    // Handle file selection
    const handleFileSelect = (files: File[]) => {
      const validFiles = files.filter(file => {
        const isValidType = allowedFileTypes.some(type => {
          const [category = '', ext = ''] = type.split('/');
          return ext === '*' ? file.type.startsWith(category) : file.type === type;
        });
        const isValidSize = file.size <= maxFileSize;
        return isValidType && isValidSize;
      });

      setSelectedFiles(prev => [...prev, ...validFiles]);
      return validFiles;
    };

    // Handle message sending with potential file attachments
    const handleSendMessage = async (content: string) => {
      if ((!content.trim() && selectedFiles.length === 0) || !onSendMessage) return;

      try {
        await onSendMessage(content, selectedFiles.length > 0 ? selectedFiles : undefined);
        setSelectedFiles([]);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    };

    // Handle removing a selected file
    const handleFileRemove = (index: number) => {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
      <StyledPaper ref={ref} className={className} elevation={0} {...props}>
        <ChatHeader
          title={title}
          model={model}
          availableModels={availableModels}
          onModelChange={onModelChange}
          settings={settings}
          onSettingsChange={onSettingsChange}
        />

        <ChatMessageList
          messages={messages}
          isTyping={isTyping}
          enableCodeHighlighting={enableCodeHighlighting}
          enableMarkdown={enableMarkdown}
        />

        <ChatInput
          onSendMessage={handleSendMessage}
          onFileSelect={handleFileSelect}
          selectedFiles={selectedFiles}
          onFileRemove={handleFileRemove}
          allowedFileTypes={allowedFileTypes}
          maxFileSize={maxFileSize}
        />
      </StyledPaper>
    );
  }
);

ChatContainer.displayName = 'ChatContainer';
