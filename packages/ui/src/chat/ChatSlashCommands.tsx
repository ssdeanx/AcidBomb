'use client';

import * as React from 'react';
import { useTheme } from '@mui/material';
import {
  SmartToy as SmartToyIcon,
  Psychology as PsychologyIcon,
  SettingsSuggest as SettingsSuggestIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  MenuBook as MenuBookIcon,
  InsertDriveFile as FileIcon,
  Code as CodeIcon,
  Cloud as CloudIcon,
  AddCircleOutline as AddIcon
} from '@mui/icons-material';
import type { CommandOption, CommandType } from './ChatCommandInput';

/**
 * Props for the ChatSlashCommands component
 */
export interface ChatSlashCommandsProps {
  /**
   * Handler for when a command is executed
   */
  onCommandExecute?: (command: string, params?: string) => void | Promise<void>;

  /**
   * Available models for the model command
   */
  availableModels?: Array<{
    id: string;
    name: string;
    provider?: string;
  }>;

  /**
   * Available tools that can be used with the tools command
   */
  availableTools?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;

  /**
   * Default tools to include
   * @default true
   */
  includeDefaultTools?: boolean;

  /**
   * Whether to include model-related commands
   * @default true
   */
  includeModelCommands?: boolean;

  /**
   * Whether to include memory-related commands
   * @default true
   */
  includeMemoryCommands?: boolean;

  /**
   * Custom commands to include
   */
  customCommands?: CommandOption[];
}

/**
 * Manages slash command definitions for chat interactions
 *
 * @function
 */
export const ChatSlashCommands = ({
  onCommandExecute,
  availableModels = [],
  availableTools = [],
  includeDefaultTools = true,
  includeModelCommands = true,
  includeMemoryCommands = true,
  customCommands = [],
}: ChatSlashCommandsProps) => {
  const theme = useTheme();

  // Define base commands
  const baseCommands: CommandOption[] = React.useMemo(() => [
    {
      id: 'help',
      name: 'help',
      type: 'slash' as CommandType,
      description: 'Show available commands',
      icon: <MenuBookIcon />,
      category: 'general',
    },
    {
      id: 'clear',
      name: 'clear',
      type: 'slash' as CommandType,
      description: 'Clear the chat history',
      icon: <ClearIcon />,
      category: 'general',
    },
  ], []); // onCommandExecute is not needed here as action is removed

  // Define model commands
  const modelCommands: CommandOption[] = React.useMemo(() => (
    includeModelCommands
      ? [
          {
            id: 'model',
            name: 'model',
            type: 'slash' as CommandType,
            description: 'Change the AI model',
            icon: <SmartToyIcon />,
            category: 'ai',
          },
          ...availableModels.map(model => ({
            id: `model_${model.id}`,
            name: `model ${model.name}`, // Consider if just model.name is better
            type: 'slash' as CommandType,
            description: `Switch to ${model.name}${model.provider ? ` (${model.provider})` : ''}`,
            icon: <SmartToyIcon />,
            category: 'ai',
            // Parameters might be needed here if the command takes arguments
            // parameters: [{ name: 'modelId', type: 'string', required: true, defaultValue: model.id }]
          })),
          {
            id: 'temperature',
            name: 'temperature',
            type: 'slash' as CommandType,
            description: 'Set AI response creativity (0-1)',
            icon: <PsychologyIcon />,
            category: 'ai',
            // parameters: [{ name: 'value', type: 'number', required: true }]
          }
        ]
      : []
  ), [includeModelCommands, availableModels]); // onCommandExecute removed

  // Define tool commands
  const toolCommands: CommandOption[] = React.useMemo(() => (
    includeDefaultTools
      ? [
          {
            id: 'tools',
            name: 'tools',
            type: 'slash' as CommandType,
            description: 'Manage available tools',
            icon: <SettingsSuggestIcon />,
            category: 'tools',
          },
          ...availableTools.map(tool => ({
            id: `tool_${tool.id}`,
            name: `tool ${tool.name}`, // Consider if just tool.name is better
            type: 'slash' as CommandType,
            description: tool.description || `Use the ${tool.name} tool`,
            icon: <SettingsSuggestIcon />, // Consider using tool-specific icons if available
            category: 'tools',
          })),
          {
            id: 'search',
            name: 'search',
            type: 'slash' as CommandType,
            description: 'Search the web for information',
            icon: <SearchIcon />,
            category: 'tools',
            // parameters: [{ name: 'query', type: 'string', required: true }]
          },
          {
            id: 'upload',
            name: 'upload',
            type: 'slash' as CommandType,
            description: 'Upload a file to the chat',
            icon: <UploadIcon />,
            category: 'tools',
          },
          {
            id: 'file',
            name: 'file',
            type: 'slash' as CommandType,
            description: 'Manage files in the chat',
            icon: <FileIcon />,
            category: 'tools',
          },
          {
            id: 'code',
            name: 'code',
            type: 'slash' as CommandType,
            description: 'Generate or explain code',
            icon: <CodeIcon />,
            category: 'tools',
            // parameters: [{ name: 'language', type: 'string' }, { name: 'description', type: 'string' }]
          }
        ]
      : []
  ), [includeDefaultTools, availableTools]); // onCommandExecute removed

  // Define memory commands
  const memoryCommands: CommandOption[] = React.useMemo(() => (
    includeMemoryCommands
      ? [
          {
            id: 'memory',
            name: 'memory',
            type: 'slash' as CommandType,
            description: 'Manage conversation memory',
            icon: <CloudIcon />,
            category: 'memory',
          },
          {
            id: 'refresh',
            name: 'refresh',
            type: 'slash' as CommandType,
            description: 'Refresh AI context and memory',
            icon: <RefreshIcon />,
            category: 'memory',
          },
          {
            id: 'forget',
            name: 'forget',
            type: 'slash' as CommandType,
            description: 'Make AI forget conversation history',
            icon: <ClearIcon />,
            category: 'memory',
          }
        ]
      : []
  ), [includeMemoryCommands]); // onCommandExecute removed

  // Combine all commands
  const allCommands: CommandOption[] = React.useMemo(() => [
    ...baseCommands,
    ...modelCommands,
    ...toolCommands,
    ...memoryCommands,
    ...customCommands, // Assuming customCommands already conform to CommandOption
    {
      id: 'custom',
      name: 'custom',
      type: 'slash' as CommandType,
      description: 'Add a custom command',
      icon: <AddIcon />,
      category: 'general',
    }
  ], [
    baseCommands,
    modelCommands,
    toolCommands,
    memoryCommands,
    customCommands
  ]);

  return { commands: allCommands };
};
ChatSlashCommands.displayName = 'ChatSlashCommands';
export default ChatSlashCommands;
