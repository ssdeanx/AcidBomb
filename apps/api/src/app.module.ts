// apps/api/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <--- Import ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MastraCoreModule } from './mastra-core/mastra-core.module';
import { ChatModule } from './chat/chat.module';
// Import other modules if needed

@Module({
  imports: [
    // --- Add ConfigModule here ---
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigService available everywhere without importing ConfigModule again
      cache: true, // Recommended for performance
      // envFilePath: '.env.local', // Optional: Specify if your file isn't just '.env'
      // ignoreEnvFile: process.env.NODE_ENV === 'production', // Optional: Don't load .env in prod
    }),
    // --- Your existing modules ---
    MastraCoreModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Note: If SupabaseAuthGuard is used globally (e.g., via app.useGlobalGuards in main.ts),
    // it doesn't need to be listed here. If it's provided specifically by another module,
    // ensure ConfigModule is available there too (or rely on isGlobal: true).
  ],
})
export class AppModule {}
