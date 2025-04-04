/**
 * DeanMachines - Theme Module
 * Handles theme management with Supabase integration
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'; // Import SupabaseClient type
import { type ThemeMode } from '@repo/ui/Appbar'; // Corrected import path

/**
 * Interface for user theme preferences stored in Supabase
 */
interface ThemePreference {
  user_id: string;
  theme: ThemeMode;
  created_at?: string; // Added created_at for consistency with insert
  updated_at?: string;
}

/**
 * Class for managing theme settings with Supabase
 */
export class ThemeManager {
  private supabase: SupabaseClient; // Use SupabaseClient type

  /**
   * Initialize the theme manager with Supabase client
   *
   * @param supabaseUrl - Supabase project URL
   * @param supabaseKey - Supabase anon key
   */
  constructor(supabaseUrl: string, supabaseKey: string) {
    // Add basic validation for URL and Key
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key are required.');
    }
    this.supabase = createClient(supabaseUrl, supabaseKey); // Initialize Supabase client
  }

  /**
   * Get the current user's theme preference from Supabase
   *
   * @param userId - The user ID to fetch preferences for
   * @returns The user's theme preference or 'dark' as default
   * @throws Error if database operation fails unexpectedly (Supabase errors are logged)
   */
  async getUserTheme(userId: string): Promise<ThemeMode> {
    if (!userId) {
      console.warn('getUserTheme called without userId, returning default.');
      return 'dark'; // Default theme if no user ID is provided
    }

    try {
      const { data, error, status } = await this.supabase
        .from('user_preferences') // Type argument removed
        .select('theme')
        .eq('user_id', userId)
        .single<Pick<ThemePreference, 'theme'>>(); // Specify expected return type here if needed

      // Handle specific Supabase errors (e.g., row not found vs. actual DB error)
      if (error && status !== 406) { // 406 means no rows found, which is not an error here
        console.error('Error fetching user theme:', error.message);
        // Optionally re-throw a custom error or just return default
        // throw new Error(`Failed to fetch theme: ${error.message}`);
        return 'dark'; // Default to dark theme on error
      }

      // Return fetched theme or default if no record exists
      return (data?.theme) || 'dark'; // No need for 'as ThemeMode' if types align
    } catch (error: unknown) { // Catch unknown type
      // Handle unexpected errors during the fetch process
      console.error('Unexpected error fetching theme:', error);
      // Optionally re-throw or return default
      // throw error;
      return 'dark'; // Default to dark theme on unexpected error
    }
  }

  /**
   * Updates or inserts the user's theme preference in Supabase.
   * Uses upsert for simplicity and atomicity.
   *
   * @param userId - The user ID to update preferences for
   * @param theme - The theme preference to save (light, dark, or system)
   * @returns True if the operation was successful (or likely successful), false otherwise.
   * @throws Error if database operation fails unexpectedly (Supabase errors are logged)
   */
  async setUserTheme(userId: string, theme: ThemeMode): Promise<boolean> {
     if (!userId) {
      console.warn('setUserTheme called without userId.');
      return false;
    }
    try {
      const payload: Partial<ThemePreference> = {
        user_id: userId,
        theme: theme,
        updated_at: new Date().toISOString(),
      };

      const { error } = await this.supabase
        .from('user_preferences') // Type argument removed
        .upsert(
          payload as ThemePreference, // Ensure payload matches expected type for upsert
          { onConflict: 'user_id' } // Specify the conflict column for upsert
        );

      if (error) {
        console.error('Error saving user theme (upsert):', error.message);
        // Optionally throw new Error(`Failed to save theme: ${error.message}`);
        return false;
      }

      return true; // Assume success if no error is thrown
    } catch (error: unknown) {
      console.error('Unexpected error saving theme:', error);
      // Optionally re-throw
      // throw error;
      return false;
    }
  }

  // Removed getSystemTheme() - Handled by ThemeProvider
  // Removed applyTheme() - Handled by ThemeProvider
}
