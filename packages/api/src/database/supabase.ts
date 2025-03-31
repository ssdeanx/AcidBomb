/**
 * Supabase client configuration for the API package.
 * Provides database access and authentication services.
 */
import { createClient } from '@supabase/supabase-js';
import { getEnvVar } from '../utils/env';

// Initialize Supabase client with environment variables
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // We don't need to persist session in the API
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public',
  },
});

// Export typed helpers for database access
export type Database = {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'dark' | 'system';
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['user_preferences']['Row'],
          'created_at' | 'updated_at'
        >;
        Update: Partial<
          Database['public']['Tables']['user_preferences']['Insert']
        >;
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          agent_id: string;
          title: string;
          created_at: string;
          updated_at: string;
          last_message_at: string;
          metadata: Record<string, unknown>;
        };
        Insert: Omit<
          Database['public']['Tables']['conversations']['Row'],
          'created_at' | 'updated_at' | 'last_message_at'
        >;
        Update: Partial<
          Database['public']['Tables']['conversations']['Insert']
        >;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          created_at: string;
          metadata: Record<string, unknown>;
        };
        Insert: Omit<
          Database['public']['Tables']['messages']['Row'],
          'created_at'
        >;
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
