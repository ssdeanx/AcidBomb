/**
 * React hook for interacting with Mastra agents through the API.
 * Provides messaging functionality with streaming response support.
 *
 * @module apps/web/src/mastra/hooks/useAgent
 */

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Message structure for agent communication
 */
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Agent response structure
 */
interface AgentResponse {
  text: string;
  threadId: string;
}

/**
 * Hook configuration options
 */
interface UseAgentOptions {
  /**
   * Initial messages to load into the conversation
   */
  initialMessages?: Message[];

  /**
   * Initial thread ID for continuing a conversation
   */
  initialThreadId?: string;

  /**
   * Whether to use streaming responses (default: true)
   */
  streaming?: boolean;

  /**
   * Optional API base URL override
   */
  apiBaseUrl?: string;
}

/**
 * Hook return values
 */
interface UseAgentReturn {
  /** Messages in the current conversation */
  messages: Message[];

  /** Whether a request is currently in progress */
  isLoading: boolean;

  /** Any error that occurred during the last request */
  error: Error | null;

  /** Function to send a message to the agent */
  sendMessage: (content: string) => Promise<void>;

  /** Current thread ID for the conversation */
  threadId: string | null;

  /** Function to reset the conversation */
  reset: () => void;
}

/**
 * React hook for interacting with Mastra agents
 *
 * @param agentName - The name of the agent to interact with
 * @param options - Configuration options for the hook
 * @returns Object containing messages, loading state, and functions to interact with the agent
 */
export function useAgent(
  agentName: string,
  options: UseAgentOptions = {}
): UseAgentReturn {
  const {
    initialMessages = [],
    initialThreadId = null,
    streaming = true,
    apiBaseUrl = '/api',
  } = options;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [threadId, setThreadId] = useState<string | null>(initialThreadId);

  // Reference to the EventSource for streaming responses
  const eventSourceRef = useRef<EventSource | null>(null);

  // Cleanup function for the EventSource
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  /**
   * Reset the conversation
   */
  const reset = useCallback(() => {
    setMessages([]);
    setThreadId(null);
    setError(null);

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  /**
   * Send a message to the agent
   *
   * @param content - The message content to send
   */
  const sendMessage = useCallback(
    async (content: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Add user message to state immediately
        const userMessage: Message = { role: 'user', content };
        setMessages((prev) => [...prev, userMessage]);

        // Close any existing EventSource
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }

        // Handle streaming response
        if (streaming) {
          // Add placeholder assistant message
          const placeholderMessage: Message = { role: 'assistant', content: '' };
          setMessages((prev) => [...prev, placeholderMessage]);

          // Prepare the request URL with the threadId if available
          const url = new URL(`${apiBaseUrl}/agents/${agentName}/generate`, window.location.origin);
          if (threadId) {
            url.searchParams.append('threadId', threadId);
          }

          // Create a new EventSource for server-sent events
          const eventSource = new EventSource(
            url.toString(),
            {
              withCredentials: true,
            }
          );

          eventSourceRef.current = eventSource;

          // Process streaming response chunks
          eventSource.onmessage = (event) => {
            if (event.data === '[DONE]') {
              eventSource.close();
              eventSourceRef.current = null;
              setIsLoading(false);
              return;
            }

            try {
              const data = JSON.parse(event.data);

              // Store threadId if provided
              if (data.threadId && !threadId) {
                setThreadId(data.threadId);
              }

              // Update assistant message with new content
              if (data.text !== undefined) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMessage = updated[updated.length - 1];

                  // Ensure lastMessage exists and is an assistant message before updating
                  if (lastMessage && lastMessage.role === 'assistant') {
                    updated[updated.length - 1] = {
                      ...lastMessage,
                      content: lastMessage.content + data.text,
                    };
                  }

                  return updated;
                });
              }
            } catch (err) {
              console.error('Error parsing SSE data:', err);
            }
          };

          // Handle errors
          eventSource.onerror = (err) => {
            console.error('EventSource error:', err);
            eventSource.close();
            eventSourceRef.current = null;
            setIsLoading(false);
            setError(new Error('Connection error. Please try again.'));
          };

          return;
        }

        // Handle non-streaming response
        const response = await fetch(`${apiBaseUrl}/agents/${agentName}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            threadId,
            stream: false,
          }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const data: AgentResponse = await response.json();

        // Store threadId if provided
        if (data.threadId) {
          setThreadId(data.threadId);
        }

        // Add assistant response to messages
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.text },
        ]);
      } catch (err) {
        console.error('Send message error:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [agentName, apiBaseUrl, messages, threadId, streaming]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    threadId,
    reset,
  };
}
