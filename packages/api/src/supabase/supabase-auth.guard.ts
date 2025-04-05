// packages/api/src/supabase/guard.ts (or supabase-auth.guard.ts)
// This uses your existing logic but safely reads env vars via ConfigService

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject, // <-- Add Inject
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // <-- Import ConfigService
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);
  private supabase!: SupabaseClient; // Definite assignment assertion
  private isInitialized = false; // Flag to track initialization

  constructor(
    // Inject ConfigService - NestJS handles providing it when the guard runs
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    // It's better to initialize in onModuleInit or lazily,
    // but for simplicity, we'll try here with checks.
    this.initializeSupabaseClient();
  }

  // Helper function to initialize the client safely
  private initializeSupabaseClient(): void {
    try {
      const supabaseUrl = this.configService.get<string>(
        'NEXT_PUBLIC_SUPABASE_URL',
      );
      const supabaseKey = this.configService.get<string>(
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      );

      if (!supabaseUrl || !supabaseKey) {
        this.logger.error(
          'Supabase URL or Anon Key not found in environment variables. SupabaseAuthGuard will not function correctly.',
        );
        // Don't throw here, let canActivate handle the uninitialized state
        return;
      }

      this.supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false, // Usually false on backend
          detectSessionInUrl: false,
        },
      });
      this.isInitialized = true;
      this.logger.log(
        'Supabase client initialized successfully for Auth Guard.',
      );
    } catch (error) {
      // Check if error is an instance of Error before accessing properties
      if (error instanceof Error) {
        this.logger.error(
          `Failed to initialize Supabase client in Auth Guard: ${error.message}`,
          error.stack, // Safe to access stack now
        );
      } else {
        // Handle cases where the thrown value is not an Error object
        this.logger.error(
          `Failed to initialize Supabase client in Auth Guard due to an unexpected error: ${String(error)}`,
        );
      }
      this.isInitialized = false;
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the client failed to initialize
    if (!this.isInitialized || !this.supabase) {
      this.logger.error(
        'Supabase client not initialized in Guard. Denying access.',
      );
      throw new UnauthorizedException(
        'Authentication service configuration error.',
      );
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // Use the initialized Supabase client
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser(token);

      if (error) {
        this.logger.warn(
          `Supabase auth.getUser error: ${error.message} (Status: ${error.status || 'N/A'})`,
        );
        // Provide more specific messages based on common errors
        if (error.message === 'invalid JWT' || error.status === 401) {
          throw new UnauthorizedException('Invalid authentication token');
        } else if (error.message === 'JWT expired') {
          throw new UnauthorizedException('Token has expired');
        }
        // Fallback for other Supabase errors
        throw new UnauthorizedException('Authentication check failed');
      }

      if (!user) {
        // This case might indicate a valid token but represents an inactive/non-existent user
        this.logger.warn(
          'Token validated by Supabase but no user object returned.',
        );
        throw new UnauthorizedException('User not found for provided token');
      }

      // Attach the user object from Supabase to the request
      request.user = user; // Contains id, email, created_at etc.
      return true;
    } catch (error) {
      // Catch errors thrown within the try block or unexpected issues
      if (error instanceof UnauthorizedException) {
        throw error; // Re-throw specific auth errors
      }
      // Log the error appropriately, checking if it's an Error instance
      if (error instanceof Error) {
        this.logger.error(
          `Unexpected error during canActivate token validation: ${error.message}`,
          error.stack, // Access stack safely
        );
      } else {
        // Handle cases where the thrown value is not an Error object
        this.logger.error(
          `Unexpected non-Error thrown during canActivate token validation: ${String(error)}`,
        );
      }
      // Don't expose internal details in the final error
      throw new UnauthorizedException(
        'Authentication failed due to an unexpected error.',
      );
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
