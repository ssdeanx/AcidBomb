'use client';

import * as React from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Tooltip,
  styled,
  alpha,
  CircularProgress,
  Collapse,
} from '@mui/material';
import {
  Send,
  Mic,
  AttachFile,
  EmojiEmotions,
  Close,
  Article,
  Image,
  AudioFile,
  PictureAsPdf,
} from '@mui/icons-material';

/**
 * Props for the ChatInput component
 */
export interface ChatInputProps {
  /**
   * Callback when a message is sent
   */
  onSendMessage?: (content: string) => Promise<void> | void;

  /**
   * Callback when files are selected
   */
  onFileSelect?: (files: File[]) => File[];

  /**
   * Currently selected files
   */
  selectedFiles?: File[];

  /**
   * Callback when a file is removed
   */
  onFileRemove?: (index: number) => void;

  /**
   * Maximum character limit for messages
   * @default 4000
   */
  maxLength?: number;

  /**
   * If true, the input is disabled
   */
  disabled?: boolean;

  /**
   * Custom placeholder text
   * @default "Type a message..."
   */
  placeholder?: string;

  /**
   * Allowed file types for attachments
   * @default ['image/*', 'application/pdf', 'audio/*']
   */
  allowedFileTypes?: string[];

  /**
   * Maximum file size in bytes
   * @default 10485760 (10MB)
   */
  maxFileSize?: number;

  /**
   * If true, enables voice input
   * @default true
   */
  enableVoiceInput?: boolean;

  /**
   * If true, enables emoji picker
   * @default true
   */
  enableEmojiPicker?: boolean;
}

const InputContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
  borderBottomLeftRadius: theme.shape.borderRadius * 2,
  borderBottomRightRadius: theme.shape.borderRadius * 2,
}));

const AttachmentPreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  marginBottom: theme.spacing(1),
}));

const AttachmentPreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  maxWidth: '200px',
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: -8,
  right: -8,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  padding: 4,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

/**
 * Returns appropriate icon based on file type
 * @param fileType MIME type of the file
 * @returns React component for the file type icon
 */
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) {
    return <Image fontSize="small" />;
  } else if (fileType === 'application/pdf') {
    return <PictureAsPdf fontSize="small" />;
  } else if (fileType.startsWith('audio/')) {
    return <AudioFile fontSize="small" />;
  } else {
    return <Article fontSize="small" />;
  }
};

/**
 * Format file size for display
 * @param bytes File size in bytes
 * @returns Formatted file size string (KB, MB)
 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

/**
 * ChatInput component for entering messages and uploading files
 */
export const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  ({
    onSendMessage,
    onFileSelect,
    selectedFiles = [],
    onFileRemove,
    maxLength = 4000,
    disabled = false,
    placeholder = "Type a message...",
    allowedFileTypes = ['image/*', 'application/pdf', 'audio/*'],
    maxFileSize = 10 * 1024 * 1024, // 10MB
    enableVoiceInput = true,
    enableEmojiPicker = true,
    ...props
  }, ref) => {
    const [message, setMessage] = React.useState<string>('');
    const [isRecording, setIsRecording] = React.useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const [showEmojiPicker, setShowEmojiPicker] = React.useState<boolean>(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Handle text input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.length <= maxLength) {
        setMessage(value);
      }
    };

    // Handle key press (Enter to send)
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !onFileSelect) return;

      const files = Array.from(e.target.files);
      onFileSelect(files);

      // Reset the input to allow selecting the same file again
      e.target.value = '';
    };

    // Trigger file input click
    const handleAttachClick = () => {
      fileInputRef.current?.click();
    };

    // Handle send message
    const handleSendMessage = async () => {
      if ((!message.trim() && selectedFiles.length === 0) || disabled || isSubmitting) return;

      if (onSendMessage) {
        try {
          setIsSubmitting(true);
          await onSendMessage(message);
          setMessage('');
          setShowEmojiPicker(false);
        } catch (error) {
          console.error('Failed to send message:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    // Toggle voice recording
    const handleVoiceToggle = () => {
      setIsRecording(!isRecording);
      // Voice recording logic would go here
      // This would typically use the Web Speech API or a similar library
    };

    // Handle emoji selection
    const handleEmojiSelect = (emoji: string) => {
      setMessage((prev) => prev + emoji);
    };

    return (
      <InputContainer ref={ref} elevation={0} {...props}>
        {/* File attachments preview */}
        <Collapse in={selectedFiles.length > 0}>
          <AttachmentPreviewContainer>
            {selectedFiles.map((file, index) => (
              <AttachmentPreview key={`${file.name}-${index}`}>
                {getFileIcon(file.type)}
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box sx={{
                    fontSize: '0.75rem',
                    fontWeight: 'medium',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {file.name}
                  </Box>
                  <Box sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                    {formatFileSize(file.size)}
                  </Box>
                </Box>
                {onFileRemove && (
                  <RemoveButton
                    size="small"
                    aria-label="remove file"
                    onClick={() => onFileRemove(index)}
                  >
                    <Close fontSize="small" />
                  </RemoveButton>
                )}
              </AttachmentPreview>
            ))}
          </AttachmentPreviewContainer>
        </Collapse>

        {/* Main input area */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          {/* Emoji picker button */}
          {enableEmojiPicker && (
            <Tooltip title="Emoji">
              <IconButton
                color={showEmojiPicker ? "primary" : "default"}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={disabled}
              >
                <EmojiEmotions />
              </IconButton>
            </Tooltip>
          )}

          {/* File attachment button */}
          <Tooltip title="Attach files">
            <IconButton
              onClick={handleAttachClick}
              disabled={disabled}
            >
              <AttachFile />
            </IconButton>
          </Tooltip>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedFileTypes.join(',')}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {/* Text input */}
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
              },
            }}
            InputProps={{
              sx: { py: 1 },
            }}
          />

          {/* Voice input button */}
          {enableVoiceInput && (
            <Tooltip title={isRecording ? "Stop recording" : "Voice input"}>
              <IconButton
                color={isRecording ? "error" : "default"}
                onClick={handleVoiceToggle}
                disabled={disabled}
              >
                <Mic />
              </IconButton>
            </Tooltip>
          )}

          {/* Send button */}
          <Tooltip title="Send message">
            <span>
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={(!message.trim() && selectedFiles.length === 0) || disabled || isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : <Send />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Emoji picker would be implemented here */}
        {/* This would typically use a library like emoji-mart */}
        {showEmojiPicker && (
          <Box sx={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            mb: 1,
            zIndex: 10,
            // The actual emoji picker would be rendered here
            // using a library component
          }}>
            {/* Emoji picker placeholder */}
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box>Emoji Picker would be displayed here</Box>
            </Paper>
          </Box>
        )}

        {/* Character count indicator */}
        {maxLength && message.length > 0 && (
          <Box
            sx={{
              alignSelf: 'flex-end',
              mt: 0.5,
              fontSize: '0.75rem',
              color: message.length > maxLength * 0.8 ? 'warning.main' : 'text.secondary',
            }}
          >
            {message.length}/{maxLength}
          </Box>
        )}
      </InputContainer>
    );
  }
);

ChatInput.displayName = 'ChatInput';
