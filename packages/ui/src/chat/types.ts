/**
 * Represents a chat message
 */
export interface Message {
  /**
   * Unique identifier for the message
   */
  id: string;

  /**
   * Message content
   */
  content: string;

  /**
   * Sender role
   */
  role: 'user' | 'assistant' | 'system';

  /**
   * Message timestamp
   */
  timestamp: Date;

  /**
   * Model used for generation (for AI responses)
   */
  model?: string;

  /**
   * Current message status
   */
  status?: 'sending' | 'sent' | 'error';

  /**
   * Optional array of attachment metadata
   */
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url?: string;
  }>;
}

/**
 * Represents a model option for AI
 */
export interface ModelOption {
  /**
   * Unique identifier for the model
   */
  id: string;

  /**
   * Display name for the model
   */
  name: string;

  /**
   * Optional model description
   */
  description?: string;

  /**
   * Model provider (e.g., "OpenAI", "Anthropic", etc.)
   */
  provider?: string;

  /**
   * Optional context window size (in tokens)
   */
  contextWindow?: number;

  /**
   * Additional model capabilities
   */
  capabilities?: {
    /**
     * If true, model can process images
     */
    vision?: boolean;

    /**
     * If true, model can process audio
     */
    audio?: boolean;

    /**
     * If true, model can generate images
     */
    imageGeneration?: boolean;
  };
}

/**
 * Chat settings for controlling AI behavior
 */
export interface ChatSettings {
  /**
   * Model temperature (0.0 - 1.0)
   */
  temperature?: number;

  /**
   * Maximum output tokens
   */
  maxTokens?: number;

  /**
   * Top-p sampling parameter
   */
  topP?: number;

  /**
   * Frequency penalty
   */
  frequencyPenalty?: number;

  /**
   * Presence penalty
   */
  presencePenalty?: number;

  /**
   * System prompt/instructions
   */
  systemPrompt?: string;
}

/**
 * Represents a file attachment
 */
export interface Attachment {
  /**
   * Unique identifier for the attachment
   */
  id: string;

  /**
   * File name
   */
  name: string;

  /**
   * MIME type
   */
  type: string;

  /**
   * File size in bytes
   */
  size: number;

  /**
   * Optional URL to the file
   */
  url?: string;

  /**
   * Optional file content as base64
   */
  content?: string;
}
