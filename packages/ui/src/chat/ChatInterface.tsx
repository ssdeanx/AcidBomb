'use client';

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  Container,
  styled,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  SmartToy as SmartToyIcon,
  Construction as ToolsIcon,
} from '@mui/icons-material';

// Import our chat components
import { ChatMessageList } from './ChatMessageList';
import { ChatCommandInput } from './ChatCommandInput';
import { ChatAgentPanel } from './ChatAgentPanel';
import { ChatToolsPanel } from './ChatToolsPanel';
import { ChatSlashCommands } from './ChatSlashCommands';
import { type Agent } from './ChatAgentPanel';
import { type Tool } from './ChatToolsPanel';
import { type CommandOption } from './ChatCommandInput';
import { type Attachment, type Message } from './types';

/**
 * Props for the ChatInterface component
 */
export interface ChatInterfaceProps {
  /**
   * Array of messages to display
   */
  messages: Message[];

  /**
   * Handler for sending a new message
   */
  onSendMessage: (message: string, attachments?: Attachment[]) => void | Promise<void>;

  /**
   * Handler for executing a command
   */
  onCommandExecute?: (command: string, params?: string) => void | Promise<void>;

  /**
   * Whether the interface is currently loading or processing a message
   * @default false
   */
  isLoading?: boolean;

  /**
   * Currently selected agent
   */
  selectedAgent?: Agent;

  /**
   * List of available AI agents
   */
  availableAgents?: Agent[];

  /**
   * Handler for selecting an agent
   */
  onAgentSelect?: (agent: Agent) => void;

  /**
   * List of available tools
   */
  availableTools?: Tool[];

  /**
   * Handler for toggling a tool
   */
  onToolToggle?: (tool: Tool, enabled: boolean) => void;

  /**
   * Available models for model selection
   */
  availableModels?: Array<{
    id: string;
    name: string;
    provider?: string;
  }>;

  /**
   * Whether to show the agent panel toggle button
   * @default true
   */
  showAgentPanel?: boolean;

  /**
   * Whether to show the tools panel toggle button
   * @default true
   */
  showToolsPanel?: boolean;

  /**
   * Whether to show the settings button
   * @default true
   */
  showSettings?: boolean;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Handler for when settings are opened
   */
  onOpenSettings?: () => void;

  /**
   * Handler for file uploads
   */
  onFileUpload?: (files: FileList) => Promise<Attachment[]>;

  /**
   * Custom slash commands
   */
  customSlashCommands?: CommandOption[];

  /**
   * Custom mentions
   */
  customMentions?: CommandOption[];

  /**
   * Custom hashtags
   */
  customHashtags?: CommandOption[];

  /**
   * Whether to enable code highlighting in messages
   * @default true
   */
  enableCodeHighlighting?: boolean;

  /**
   * Whether to enable markdown formatting in messages
   * @default true
   */
  enableMarkdown?: boolean;

  /**
   * Whether to show the file upload button
   * @default true
   */
  showFileUpload?: boolean;

  /**
   * Whether to show the emoji picker button
   * @default true
   */
  showEmojiPicker?: boolean;

  /**
   * Whether to show the voice input button
   * @default false
   */
  showVoiceInput?: boolean;

  /**
   * Maximum message length
   */
  maxMessageLength?: number;

  /**
   * Custom empty state message
   */
  emptyStateMessage?: string;

  /**
   * Container width
   * @default '100%'
   */
  width?: string | number;

  /**
   * Container height
   * @default '600px'
   */
  height?: string | number;
}

// Styled components
const ChatContainer = styled(Paper, {
  shouldForwardProp: (prop) => !['chatWidth', 'chatHeight'].includes(prop as string),
})<{ chatWidth: string | number; chatHeight: string | number }>(
  ({ theme, chatWidth, chatHeight }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: chatWidth,
    height: chatHeight,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    backdropFilter: 'blur(10px)',
    boxShadow: theme.shadows[3],
  })
);

const ChatHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: '64px',
}));

const ChatBody = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const ChatFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const AgentInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const HeaderActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

/**
 * ChatInterface provides a complete chat interface with message history, input,
 * and optional panels for agent selection and tools
 *
 * @component
 */
export const ChatInterface = React.forwardRef<HTMLDivElement, ChatInterfaceProps>(
  ({
    messages,
    onSendMessage,
    onCommandExecute,
    isLoading = false,
    selectedAgent,
    availableAgents = [],
    onAgentSelect,
    availableTools = [],
    onToolToggle,
    availableModels = [],
    showAgentPanel = true,
    showToolsPanel = true,
    showSettings = true,
    className,
    onOpenSettings,
    onFileUpload,
    customSlashCommands = [],
    customMentions = [],
    customHashtags = [],
    enableCodeHighlighting = true,
    enableMarkdown = true,
    showFileUpload = true,
    showEmojiPicker = true,
    showVoiceInput = false,
    maxMessageLength,
    emptyStateMessage,
    width = '100%',
    height = '600px',
  }, ref) => {
    const theme = useTheme();
    const [inputValue, setInputValue] = React.useState('');
    const [agentPanelOpen, setAgentPanelOpen] = React.useState(false);
    const [toolsPanelOpen, setToolsPanelOpen] = React.useState(false);
    const [pendingAttachments, setPendingAttachments] = React.useState<Attachment[]>([]);
    const [uploadingFiles, setUploadingFiles] = React.useState(false);

    // Handler for sending a message
    const handleSendMessage = async (message: string): Promise<void> => {
      if (uploadingFiles) return;

      try {
        await onSendMessage(message, pendingAttachments.length > 0 ? pendingAttachments : undefined);
        // Clear pending attachments after sending
        setPendingAttachments([]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    // Handler for executing commands
    const handleCommandExecute = (command: CommandOption, params?: string): void => {
      if (onCommandExecute) {
        onCommandExecute(command.name, params);
      }
    };

    // Handler for file uploads
    const handleFileUpload = async (files: FileList): Promise<void> => {
      if (!onFileUpload) return;

      try {
        setUploadingFiles(true);

        // Generate temporary local attachments with upload progress
        const tempAttachments: Attachment[] = Array.from(files).map((file, index) => ({
          id: `temp-${Date.now()}-${index}`,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadProgress: 0,
        }));

        // Add them to pending attachments
        setPendingAttachments(prev => [...prev, ...tempAttachments]);

        // Upload files and get real attachments
        const uploadedAttachments = await onFileUpload(files);

        // Replace temp attachments with real ones
        setPendingAttachments(prev => {
          const remaining = prev.filter(
            att => !tempAttachments.some(temp => temp.id === att.id)
          );
          return [...remaining, ...uploadedAttachments];
        });
      } catch (error) {
        console.error('Error uploading files:', error);
        // Remove temp attachments on error
        setPendingAttachments(prev =>
          prev.filter(att => !att.id.startsWith('temp-'))
        );
      } finally {
        setUploadingFiles(false);
      }
    };

    // Handler for removing an attachment
    const handleRemoveAttachment = (attachmentId: string): void => {
      setPendingAttachments(prev =>
        prev.filter(att => att.id !== attachmentId)
      );
    };

    // Toggle agent panel
    const toggleAgentPanel = (): void => {
      setAgentPanelOpen(prev => !prev);
      if (toolsPanelOpen) {
        setToolsPanelOpen(false);
      }
    };

    // Toggle tools panel
    const toggleToolsPanel = (): void => {
      setToolsPanelOpen(prev => !prev);
      if (agentPanelOpen) {
        setAgentPanelOpen(false);
      }
    };

    // Generate combined slash commands
    const combinedSlashCommands = React.useMemo(() => {
      // Include default commands (can be extended)
      const defaultCommands: CommandOption[] = [
        {
          id: 'help',
          name: 'help',
          type: 'slash',
          description: 'Show available commands',
          icon: <MenuIcon fontSize="small" />,
        },
        {
          id: 'clear',
          name: 'clear',
          type: 'slash',
          description: 'Clear chat history',
          icon: <MenuIcon fontSize="small" />,
        },
      ];

      return [...defaultCommands, ...customSlashCommands];
    }, [customSlashCommands]);

    return (
      <ChatContainer
        ref={ref}
        className={className}
        chatWidth={width}
        chatHeight={height}
        elevation={3}
      >
        <ChatHeader>
          <AgentInfo>
            {selectedAgent ? (
              <>
                {selectedAgent.avatar ? (
                  typeof selectedAgent.avatar === 'string' ? (
                    <img
                      src={selectedAgent.avatar}
                      alt={selectedAgent.name}
                      style={{ width: 32, height: 32, borderRadius: '50%' }}
                    />
                  ) : (
                    selectedAgent.avatar
                  )
                ) : (
                  <SmartToyIcon />
                )}
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {selectedAgent.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedAgent.model}
                    {selectedAgent?.model && selectedAgent.provider && ` • ${selectedAgent.provider}`}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <SmartToyIcon />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    AI Assistant
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Select an agent to begin
                  </Typography>
                </Box>
              </>
            )}
          </AgentInfo>

          <HeaderActions>
            {showAgentPanel && availableAgents.length > 0 && (
              <IconButton
                onClick={toggleAgentPanel}
                color={agentPanelOpen ? 'primary' : 'default'}
                size="small"
              >
                <SmartToyIcon />
              </IconButton>
            )}

            {showToolsPanel && availableTools.length > 0 && (
              <IconButton
                onClick={toggleToolsPanel}
                color={toolsPanelOpen ? 'primary' : 'default'}
                size="small"
              >
                <ToolsIcon />
              </IconButton>
            )}

            {showSettings && (
              <IconButton
                onClick={onOpenSettings}
                size="small"
              >
                <SettingsIcon />
              </IconButton>
            )}
          </HeaderActions>
        </ChatHeader>

        <ChatBody>
          <ChatMessageList
            messages={messages}
            isTyping={isLoading}
            enableCodeHighlighting={enableCodeHighlighting}
            enableMarkdown={enableMarkdown}
            emptyStateMessage={emptyStateMessage}
          />
        </ChatBody>

        <ChatFooter>
          <ChatCommandInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onCommandSelect={handleCommandExecute}
            onFileUpload={handleFileUpload}
            slashCommands={combinedSlashCommands}
            mentions={customMentions}
            hashtags={customHashtags}
            disabled={isLoading || uploadingFiles}
            isLoading={isLoading || uploadingFiles}
            showFileUpload={showFileUpload}
            showEmojiPicker={showEmojiPicker}
            showVoiceInput={showVoiceInput}
            maxLength={maxMessageLength}
          />

          {/* Render pending attachments if any */}
          {pendingAttachments.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {/* Use ChatAttachments component here */}
              {/* This is just a placeholder for the structure */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {pendingAttachments.map(attachment => (
                  <Paper
                    key={attachment.id}
                    sx={{
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="caption" noWrap sx={{ maxWidth: 150 }}>
                      {attachment.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                    >
                      ✕
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </ChatFooter>

        {/* Agent Selection Panel */}
        {showAgentPanel && (
          <ChatAgentPanel
            open={agentPanelOpen}
            onClose={() => setAgentPanelOpen(false)}
            agents={availableAgents}
            selectedAgentId={selectedAgent?.id}
            onAgentSelect={onAgentSelect}
          />
        )}

        {/* Tools Panel */}
        {showToolsPanel && (
          <ChatToolsPanel
            open={toolsPanelOpen}
            onClose={() => setToolsPanelOpen(false)}
            tools={availableTools}
            onToolToggle={onToolToggle}
          />
        )}
      </ChatContainer>
    );
  }
);

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;
