import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  jsonb,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

/**
 * Users table for storing basic user information.
 * This is typically linked with Supabase Auth users.
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
  email: varchar('email', { length: 256 }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => sql`NOW()`),
});

/**
 * Theme enum for user preferences
 */
export const themeEnum = pgEnum('theme', ['light', 'dark', 'system']);

/**
 * Role enum for message types
 */
export const roleEnum = pgEnum('role', ['user', 'assistant', 'system']);

/**
 * User preferences table for storing user-specific settings.
 * Contains theme preferences, language settings, and other customization options.
 */
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  theme: themeEnum('theme').default('system'),
  language: text('language'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => sql`NOW()`),
});

/**
 * Conversations table for tracking chat sessions.
 * Links users with specific agents and stores metadata about conversations.
 */
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  agentId: text('agent_id').notNull(),
  title: text('title').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => sql`NOW()`),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => sql`NOW()`),
  isPinned: boolean('is_pinned').default(false),
  isArchived: boolean('is_archived').default(false),
});

/**
 * Messages table for storing individual messages within a conversation.
 * Each message is linked to a specific conversation.
 */
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull(),
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  isError: boolean('is_error').default(false),
  isProcessing: boolean('is_processing').default(false),
  tokenCount: jsonb('token_count'),
});

/**
 * Vector embeddings table for storing conversation and document embeddings
 * Linked to the Pinecone vector store through external ID mapping
 */
export const vectorEmbeddings = pgTable('vector_embeddings', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: text('external_id').notNull().unique(),
  objectType: text('object_type').notNull(), // 'message', 'document', 'conversation'
  objectId: uuid('object_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  metadata: jsonb('metadata'),
  namespace: text('namespace'),
});

/**
 * Documents table for storing uploaded or generated documents
 * These can be RAG sources or conversation exports
 */
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  contentType: text('content_type').notNull(),
  source: text('source'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => sql`NOW()`),
  metadata: jsonb('metadata'),
  isIndexed: boolean('is_indexed').default(false),
});

/**
 * User activity logs for analytics and history
 */
export const userActivities = pgTable('user_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  activityType: text('activity_type').notNull(),
  resourceType: text('resource_type'),
  resourceId: text('resource_id'),
  details: jsonb('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
});

/**
 * Relations for the conversations table.
 */
export const conversationsRelations = relations(conversations, ({ many, one }) => ({
  messages: many(messages),
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
}));

/**
 * Relations for the messages table.
 */
export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

/**
 * Relations for the user preferences table.
 */
export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

/**
 * Relations for documents table
 */
export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));

/**
 * Relations for user activities table
 */
export const userActivitiesRelations = relations(userActivities, ({ one }) => ({
  user: one(users, {
    fields: [userActivities.userId],
    references: [users.id],
  }),
}));
