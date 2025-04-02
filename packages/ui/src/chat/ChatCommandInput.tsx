'use client';

import * as React from 'react';
import {
  Box,
  TextField,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Popper,
  ClickAwayListener,
  Grow,
  IconButton,
  InputAdornment,
  Tooltip,
  styled,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Mic as MicIcon,
} from '@mui/icons-material';

/**
 * Types of commands supported in the chat input
 */
export type CommandType = 'slash' | 'mention' | 'hashtag';

/**
 * Interface for a command option
 */
export interface CommandOption {
  /** Unique identifier for the command */
  id: string;

  /** Display name for the command */
  name: string;

  /** Command type (slash, mention, hashtag) */
  type: CommandType;

  /** Description of what the command does */
  description?: string;

  /** Icon to display with the command */
  icon?: React.ReactNode;

  /** Prefix to use when displaying the command (defaults based on type) */
  prefix?: string;

  /** Additional parameters the command accepts */
  parameters?: Array<{
    name: string;
    description?: string;
    required?: boolean;
    type?: 'string' | 'number' | 'boolean';
    defaultValue?: string | number | boolean;
  }>;

  /** Whether the command is disabled */
  disabled?: boolean;

  /** Category for grouping commands */
  category?: string;

  /** Keywords for improved search */
  keywords?: string[];
}

/**
 * Props for the ChatCommandInput component
 */
export interface ChatCommandInputProps {
  /**
   * Current value of the input
   */
  value: string;

  /**
   * Handler for when the input value changes
   */
  onChange: (value: string) => void;

  /**
   * Handler for when a message is sent
   */
  onSend: (message: string) => void;

  /**
   * Handler for when a command is selected
   */
  onCommandSelect?: (command: CommandOption, params?: string) => void;

  /**
   * Handler for when a file is uploaded
   */
  onFileUpload?: (files: FileList) => void;

  /**
   * Available slash commands
   */
  slashCommands?: CommandOption[];

  /**
   * Available mentions
   */
  mentions?: CommandOption[];

  /**
   * Available hashtags
   */
  hashtags?: CommandOption[];

  /**
   * Placeholder text for the input
   */
  placeholder?: string;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Whether the input is loading
   */
  isLoading?: boolean;

  /**
   * Whether to show the file upload button
   * @default true
   */
  showFileUpload?: boolean;

  /**
   * Whether to show the emoji button
   * @default true
   */
  showEmojiPicker?: boolean;

  /**
   * Whether to show the voice input button
   * @default false
   */
  showVoiceInput?: boolean;

  /**
   * Whether to auto-focus the input on mount
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Maximum length of the input
   */
  maxLength?: number;

  /**
   * Custom class name
   */
  className?: string;
}

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(8px)',
  boxShadow: theme.shadows[2],
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    padding: theme.spacing(1, 0),
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
}));

const CommandPopper = styled(Popper)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1,
  width: '100%',
  maxWidth: 400,
}));

const CommandPaper = styled(Paper)(({ theme }) => ({
  maxHeight: 300,
  overflow: 'auto',
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(8px)',
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
}));

const HighlightedText = styled('span')(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  borderRadius: 4,
  padding: '2px 0',
}));

/**
 * Helper function to get command prefix
 *
 * @param type - Type of command
 * @returns The prefix character
 */
const getCommandPrefix = (type: CommandType): string => {
  switch (type) {
    case 'slash':
      return '/';
    case 'mention':
      return '@';
    case 'hashtag':
      return '#';
    default:
      return '/';
  }
};

/**
 * Parsing utility to extract command tokens from input
 *
 * @param input - The input string to parse
 * @returns An object with the current token being typed and its details
 */
export const parseCommandInput = (
  input: string
): {
  isTypingCommand: boolean;
  commandType: CommandType | null;
  commandText: string;
  selectionStart: number;
  selectionEnd: number;
} => {
  // If no input, not typing a command
  if (!input) {
    return {
      isTypingCommand: false,
      commandType: null,
      commandText: '',
      selectionStart: 0,
      selectionEnd: 0,
    };
  }

  // Look for command patterns: /(slash), @(mention), #(hashtag)
  const slashRegex = /(?:^|\s)\/(\S*)$/;
  const mentionRegex = /(?:^|\s)@(\S*)$/;
  const hashtagRegex = /(?:^|\s)#(\S*)$/;

  const slashMatch = input.match(slashRegex);
  const mentionMatch = input.match(mentionRegex);
  const hashtagMatch = input.match(hashtagRegex);

  // Find which one matched
  if (slashMatch) {
    const startPos = input.lastIndexOf('/');
    return {
      isTypingCommand: true,
      commandType: 'slash',
      commandText: slashMatch[1] || '',
      selectionStart: startPos,
      selectionEnd: input.length,
    };
  }

  if (mentionMatch) {
    const startPos = input.lastIndexOf('@');
    return {
      isTypingCommand: true,
      commandType: 'mention',
      commandText: mentionMatch[1] || '',
      selectionStart: startPos,
      selectionEnd: input.length,
    };
  }

  if (hashtagMatch) {
    const startPos = input.lastIndexOf('#');
    return {
      isTypingCommand: true,
      commandType: 'hashtag',
      commandText: hashtagMatch[1] || '',
      selectionStart: startPos,
      selectionEnd: input.length,
    };
  }

  // No command found
  return {
    isTypingCommand: false,
    commandType: null,
    commandText: '',
    selectionStart: input.length,
    selectionEnd: input.length,
  };
};

/**
 * ChatCommandInput provides a text input with support for slash commands, mentions, and hashtags
 *
 * @component
 */
export const ChatCommandInput = React.forwardRef<HTMLDivElement, ChatCommandInputProps>(
  ({
    value,
    onChange,
    onSend,
    onCommandSelect,
    onFileUpload,
    slashCommands = [],
    mentions = [],
    hashtags = [],
    placeholder = 'Type a message or use / for commands',
    disabled = false,
    isLoading = false,
    showFileUpload = true,
    showEmojiPicker = true,
    showVoiceInput = false,
    autoFocus = false,
    maxLength,
    className,
  }, ref) => {
    const theme = useTheme();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [commandMenuOpen, setCommandMenuOpen] = React.useState(false);
    const [selectedCommandIndex, setSelectedCommandIndex] = React.useState<number | null>(null);

    // Parse the current input for commands
    const {
      isTypingCommand,
      commandType,
      commandText,
      selectionStart,
      selectionEnd
    } = parseCommandInput(value);

    // Filter commands based on input
    const filteredCommands = React.useMemo(() => {
      if (!isTypingCommand || !commandType) return [];

      let availableCommands: CommandOption[] = [];
      switch (commandType) {
        case 'slash':
          availableCommands = slashCommands;
          break;
        case 'mention':
          availableCommands = mentions;
          break;
        case 'hashtag':
          availableCommands = hashtags;
          break;
        default:
          return [];
      }

      if (!commandText) return availableCommands;

      const lowerCaseQuery = commandText.toLowerCase();
      return availableCommands.filter(command => {
        // Check name
        if (command.name.toLowerCase().includes(lowerCaseQuery)) {
          return true;
        }

        // Check keywords
        if (command.keywords?.some(keyword => keyword.toLowerCase().includes(lowerCaseQuery))) {
          return true;
        }

        // Check description
        if (command.description?.toLowerCase().includes(lowerCaseQuery)) {
          return true;
        }

        return false;
      });
    }, [commandType, commandText, slashCommands, mentions, hashtags, isTypingCommand]);

    // Reset selected command when filtered commands change
    React.useEffect(() => {
      setSelectedCommandIndex(filteredCommands.length > 0 ? 0 : null);
    }, [filteredCommands]);

    // Show/hide command menu based on typing state
    React.useEffect(() => {
      setCommandMenuOpen(isTypingCommand && filteredCommands.length > 0);
    }, [isTypingCommand, filteredCommands]);

    // Handle sending a message
    const handleSend = (): void => {
      if (value.trim() && !disabled && !isLoading) {
        onSend(value.trim());
        onChange('');
      }
    };

    // Handle selecting a command
    const handleCommandSelect = (command: CommandOption): void => {
      if (command.disabled) return;

      if (onCommandSelect) {
        onCommandSelect(command);
      }

      // Replace the command in the input
      const prefix = getCommandPrefix(command.type);
      const beforeCommand = value.substring(0, selectionStart);
      const afterCommand = value.substring(selectionEnd);

      // Determine what to insert based on command type
      let insertText = '';

      switch (command.type) {
        case 'slash':
          // For slash commands, usually we just execute them
          onChange('');
          break;

        case 'mention':
          // For mentions, insert the mention and a space
          insertText = `${prefix}${command.name} `;
          onChange(beforeCommand.slice(0, -1) + insertText + afterCommand);
          break;

        case 'hashtag':
          // For hashtags, insert the hashtag and a space
          insertText = `${prefix}${command.name} `;
          onChange(beforeCommand.slice(0, -1) + insertText + afterCommand);
          break;

        default:
          break;
      }

      // Close the command menu
      setCommandMenuOpen(false);
    };

    // Handle key navigation for the command menu
    const handleKeyDown = (event: React.KeyboardEvent): void => {
      if (!isTypingCommand || !commandMenuOpen) {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          handleSend();
        }
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedCommandIndex(prev =>
            prev === null || prev >= filteredCommands.length - 1 ? 0 : prev + 1
          );
          break;

        case 'ArrowUp':
          event.preventDefault();
          setSelectedCommandIndex(prev =>
            prev === null || prev <= 0 ? filteredCommands.length - 1 : prev - 1
          );
          break;

        case 'Tab':
        case 'Enter':
          event.preventDefault();
          if (selectedCommandIndex !== null) {
            const selectedCommand = filteredCommands[selectedCommandIndex];
            // Ensure the command exists at the index before selecting
            if (selectedCommand) {
              handleCommandSelect(selectedCommand);
            }
          }
          break;

        case 'Escape':
          event.preventDefault();
          setCommandMenuOpen(false);
          break;

        default:
          break;
      }
    };

    // Handle file upload
    const handleFileUpload = (): void => {
      fileInputRef.current?.click();
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (event.target.files && event.target.files.length > 0 && onFileUpload) {
        onFileUpload(event.target.files);
        // Reset the input
        event.target.value = '';
      }
    };

    // Render command list item
    const renderCommandItem = (command: CommandOption, index: number): React.ReactNode => {
      const isSelected = selectedCommandIndex === index;
      const prefix = command.prefix || getCommandPrefix(command.type);

      return (
        <ListItem key={command.id} disablePadding>
          <ListItemButton
            selected={isSelected}
            onClick={() => handleCommandSelect(command)}
            disabled={command.disabled}
            dense
            sx={{
              borderRadius: 1,
              py: 1,
              px: 2,
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
              '&.Mui-selected:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            {command.icon && (
              <ListItemIcon
                sx={{ minWidth: 36, color: command.disabled ? 'text.disabled' : 'inherit' }}
              >
                {command.icon}
              </ListItemIcon>
            )}

            <ListItemText
              primary={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    component="span"
                    variant="body2"
                    fontWeight="medium"
                    color={command.disabled ? 'text.disabled' : 'text.primary'}
                  >
                    {prefix}{command.name}
                  </Typography>
                </Box>
              }
              secondary={command.description}
              secondaryTypographyProps={{
                variant: 'caption',
                color: command.disabled ? 'text.disabled' : 'text.secondary',
                noWrap: true,
              }}
            />
          </ListItemButton>
        </ListItem>
      );
    };

    return (
      <Box ref={ref} className={className} sx={{ position: 'relative', width: '100%' }}>
        <StyledPaper>
          {showFileUpload && (
            <Tooltip title="Attach files">
              <IconButton
                edge="start"
                onClick={handleFileUpload}
                disabled={disabled || isLoading}
                size="small"
                sx={{ mr: 1 }}
              >
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />

          <Box ref={anchorRef} sx={{ flexGrow: 1 }}>
            <StyledTextField
              inputRef={inputRef}
              fullWidth
              multiline
              maxRows={4}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              autoFocus={autoFocus}
              inputProps={{
                maxLength,
              }}
              sx={{ flexGrow: 1 }}
            />
          </Box>

          {showEmojiPicker && (
            <Tooltip title="Insert emoji">
              <IconButton
                disabled={disabled || isLoading}
                size="small"
                sx={{ ml: 1 }}
              >
                <EmojiIcon />
              </IconButton>
            </Tooltip>
          )}

          {showVoiceInput && (
            <Tooltip title="Voice input">
              <IconButton
                disabled={disabled || isLoading}
                size="small"
                sx={{ ml: 1 }}
              >
                <MicIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Send message">
            <span>
              <IconButton
                edge="end"
                color="primary"
                onClick={handleSend}
                disabled={!value.trim() || disabled || isLoading}
                size="small"
                sx={{ ml: 1 }}
              >
                <SendIcon />
              </IconButton>
            </span>
          </Tooltip>
        </StyledPaper>

        {/* Command menu */}
        <CommandPopper
          open={commandMenuOpen}
          anchorEl={anchorRef.current}
          transition
          placement="top-start"
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: 'bottom left' }}
            >
              <CommandPaper>
                <ClickAwayListener onClickAway={() => setCommandMenuOpen(false)}>
                  <List dense>
                    {filteredCommands.map((command, index) =>
                      renderCommandItem(command, index)
                    )}
                  </List>
                </ClickAwayListener>
              </CommandPaper>
            </Grow>
          )}
        </CommandPopper>
      </Box>
    );
  }
);

ChatCommandInput.displayName = 'ChatCommandInput';

export default ChatCommandInput;
