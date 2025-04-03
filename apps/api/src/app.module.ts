import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MastraCoreModule } from './mastra-core/mastra-core.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    MastraCoreModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
