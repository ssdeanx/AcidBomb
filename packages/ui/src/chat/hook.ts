import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './types';

export interface UseChatOptions {
  /**
   * API endpoint for chat
   */
  endpoint?: string;

  /**
   * API key for authentication
   */
  apiKey?: string;

  /**
   * Current model ID
   */
  model?: string;

  /**
   * Temperature setting (0.0-1.0)
   */
  temperature?: number;

  /**
   * Maximum tokens to generate
   */
  maxTokens?: number;

  /**
   * Initial messages to populate the chat
   */
  initialMessages?: Message[];

  /**
   * System prompt / instructions
   */
  systemPrompt?: string;

  /**
   * Function to process messages before sending
   */
  onMessagePreprocess?: (message: string) => string;

  /**
   * Function to process responses after receiving
   */
  onResponsePostprocess?: (response: string) => string;

  /**
   * Mastra client instance
   */
  mastraClient?: any;
}

/**
 * Hook for managing chat state and interactions
 */
export const useChat = ({
  endpoint = '/api/chat',
  apiKey,
  model = 'gpt-4o',
  temperature = 0.7,
  maxTokens = 1024,
  initialMessages = [],
  systemPrompt,
  onMessagePreprocess,
  onResponsePostprocess,
  mastraClient,
}: UseChatOptions = {}) => {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  /**
   * Sends a message and gets a response
   */
  const sendMessage = React.useCallback(async (content: string, attachments?: File[]) => {
    // Preprocess message if needed
    const processedContent = onMessagePreprocess ? onMessagePreprocess(content) : content;

    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      content: processedContent,
      role: 'user',
      timestamp: new Date(),
      status: 'sent',
      attachments: attachments?.map(file => ({
        id: uuidv4(),
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    };

    // Add user message to state
    setMessages(prev => [...prev, userMessage]);

    // Create placeholder for AI response
    const placeholderMessage: Message = {
      id: uuidv4(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      status: 'sending',
      model,
    };

    setIsTyping(true);
    setMessages(prev => [...prev, placeholderMessage]);

    try {
      let response: string;

      // Use Mastra client if available, otherwise use fetch API
      if (mastraClient) {
        const result = await mastraClient.chat({
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: 'user', content: processedContent }
          ],
          model,
          temperature,
          max_tokens: maxTokens,
        });
        response = result.message.content;
      } else {
        const result = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
          },
          body: JSON.stringify({
            messages: [
              ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
              ...messages.map(msg => ({
                role: msg.role,
                content: msg.content,
              })),
              { role: 'user', content: processedContent }
            ],
            model,
            temperature,
            max_tokens: maxTokens,
          }),
        });

        if (!result.ok) {
          throw new Error(`API error: ${result.status}`);
        }

        const data = await result.json();
        response = data.message?.content || data.choices?.[0]?.message?.content || '';
      }

      // Postprocess response if needed
      const processedResponse = onResponsePostprocess ? onResponsePostprocess(response) : response;

      // Update AI response message
      setMessages(prev => prev.map(msg =>
        msg.id === placeholderMessage.id
          ? { ...msg, content: processedResponse, status: 'sent' }
          : msg
      ));

      return processedResponse;
    } catch (err) {
      const error = err as Error;
      console.error('Error sending message:', error);
      setError(error);

      // Update message to error state
      setMessages(prev => prev.map(msg =>
        msg.id === placeholderMessage.id
          ? { ...msg, status: 'error' }
          : msg
      ));

      throw error;
    } finally {
      setIsTyping(false);
    }
  }, [
    endpoint,
    apiKey,
    model,
    temperature,
    maxTokens,
    messages,
    systemPrompt,
    onMessagePreprocess,
    onResponsePostprocess,
    mastraClient
  ]);

  /**
   * Clears all messages
   */
  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  /**
   * Updates a specific message
   */
  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  };

  /**
   * Deletes a specific message
   */
  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    clearMessages,
    updateMessage,
    deleteMessage,
  };
};
