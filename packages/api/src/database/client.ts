/**
 * Type-safe database client that combines Supabase and Upstash operations
 */
import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';
import { Index } from '@upstash/vector';
import { DatabaseError, handleDatabaseError } from './index';
import { getEnvVar } from '../utils/env';
import type { Database } from './supabase';
import type { VectorDocument } from './upstash';

export class DatabaseClient {
  private supabase;
  private redis;
  private vector;

  constructor() {
    // Initialize Supabase
    const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    this.supabase = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // Initialize Redis
    const redisUrl = getEnvVar('UPSTASH_REDIS_URL');
    const redisToken = getEnvVar('UPSTACK_REDIS_TOKEN');

    this.redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    // Initialize Vector store
    const vectorUrl = getEnvVar('UPSTASH_VECTOR_REST_URL');
    const vectorToken = getEnvVar('UPSTASH_VECTOR_REST_TOKEN');

    this.vector = new Index({
      url: vectorUrl,
      token: vectorToken,
    });
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  /**
   * Get user conversations
   */
  async getUserConversations(userId: string, limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from('conversations')
        .select('*, messages!messages_conversation_id_fkey(count)')
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  /**
   * Create a new conversation
   */
  async createConversation(userId: string, agentId: string, title: string) {
    try {
      const { data, error } = await this.supabase
        .from('conversations')
        .insert({
          user_id: userId,
          agent_id: agentId,
          title,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  /**
   * Add a message to a conversation
   */
  async addMessage(
    conversationId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
  ) {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation last_message_at
      await this.supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  /**
   * Store vector embeddings
   */
  async storeVectors(documents: VectorDocument[]) {
    try {
      return await this.vector.upsert(
        documents.map((doc) => ({
          id: doc.id,
          vector: doc.vector,
          metadata: doc.metadata,
        })),
      );
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  /**
   * Query similar vectors
   */
  async querySimilar(vector: number[], topK = 5) {
    try {
      return await this.vector.query({
        vector,
        topK,
        includeMetadata: true,
      });
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  /**
   * Set a Redis key with optional expiry
   */
  async setCache<T>(key: string, value: T, expirySeconds?: number) {
    try {
      if (expirySeconds) {
        return await this.redis.set(key, value, { ex: expirySeconds });
      }
      return await this.redis.set(key, value);
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  /**
   * Get a Redis key
   */
  async getCache<T>(key: string): Promise<T | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }

  /**
   * Delete a Redis key
   */
  async deleteCache(key: string) {
    try {
      return await this.redis.del(key);
    } catch (error) {
      throw handleDatabaseError(error);
    }
  }
}
