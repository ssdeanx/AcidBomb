import { gql } from 'graphql-tag';
import { DocumentNode } from 'graphql';

export const typeDefs: DocumentNode = gql`
  type Query {
    """
    Get a user's preferences
    @param userId: ID of the user
    @returns: User preferences object
    """
    userPreference(userId: ID!): UserPreference

    """
    Get conversations for a user
    @param userId: ID of the user
    @param limit: Maximum number of conversations to return
    @param offset: Number of conversations to skip
    @returns: Array of conversations
    """
    conversations(
      userId: ID!
      limit: Int = 10
      offset: Int = 0
    ): [Conversation!]!

    """
    Get a specific conversation by ID
    @param id: ID of the conversation
    @returns: Conversation object
    """
    conversation(id: ID!): Conversation

    """
    Get messages for a conversation
    @param conversationId: ID of the conversation
    @param limit: Maximum number of messages to return
    @param offset: Number of messages to skip
    @returns: Array of messages
    """
    messages(conversationId: ID!, limit: Int = 50, offset: Int = 0): [Message!]!

    """
    Get links with optional filtering
    @param userId: Optional ID to filter links by user
    @param limit: Maximum number of links to return
    @param offset: Number of links to skip
    @returns: Array of links
    """
    links(userId: ID, limit: Int = 10, offset: Int = 0): [Link!]!

    """
    Get a specific link by ID
    @param id: ID of the link
    @returns: Link object
    """
    link(id: ID!): Link
  }

  type Mutation {
    """
    Create or update user preferences
    @param input: User preference data
    @returns: Updated user preference object
    """
    upsertUserPreference(input: UserPreferenceInput!): UserPreference!

    """
    Create a new conversation
    @param input: Conversation data
    @returns: New conversation object
    """
    createConversation(input: ConversationInput!): Conversation!

    """
    Update an existing conversation
    @param id: ID of the conversation
    @param input: Updated conversation data
    @returns: Updated conversation object
    """
    updateConversation(id: ID!, input: ConversationUpdateInput!): Conversation!

    """
    Delete a conversation
    @param id: ID of the conversation to delete
    @returns: Boolean indicating success
    """
    deleteConversation(id: ID!): Boolean!

    """
    Create a new message
    @param input: Message data
    @returns: New message object
    """
    createMessage(input: MessageInput!): Message!

    """
    Create a new link
    @param input: Link data
    @returns: New link object
    """
    createLink(input: LinkInput!): Link!

    """
    Update an existing link
    @param id: ID of the link
    @param input: Updated link data
    @returns: Updated link object
    """
    updateLink(id: ID!, input: LinkUpdateInput!): Link!

    """
    Delete a link
    @param id: ID of the link to delete
    @returns: Boolean indicating success
    """
    deleteLink(id: ID!): Boolean!
  }

  type UserPreference {
    id: ID!
    userId: ID!
    theme: String!
    language: String!
    createdAt: String!
    updatedAt: String!
  }

  type Conversation {
    id: ID!
    userId: ID!
    agentId: String!
    title: String!
    createdAt: String!
    updatedAt: String!
    lastMessageAt: String!
    metadata: JSON!
    messages(limit: Int = 10, offset: Int = 0): [Message!]!
  }

  type Message {
    id: ID!
    conversationId: ID!
    role: MessageRole!
    content: String!
    createdAt: String!
    metadata: JSON!
    conversation: Conversation!
  }

  type Link {
    id: ID!
    title: String!
    url: String!
    description: String
    createdAt: String!
    updatedAt: String!
    userId: ID
  }

  enum MessageRole {
    user
    assistant
    system
  }

  scalar JSON

  input UserPreferenceInput {
    userId: ID!
    theme: String
    language: String
  }

  input ConversationInput {
    userId: ID!
    agentId: String!
    title: String!
    metadata: JSON
  }

  input ConversationUpdateInput {
    title: String
    metadata: JSON
    lastMessageAt: String
  }

  input MessageInput {
    conversationId: ID!
    role: MessageRole!
    content: String!
    metadata: JSON
  }

  input LinkInput {
    title: String!
    url: String!
    description: String
    userId: ID
  }

  input LinkUpdateInput {
    title: String
    url: String
    description: String
  }
`;
