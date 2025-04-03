import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  // Register the global filter
  app.useGlobalFilters(new GlobalHttpExceptionFilter(httpAdapterHost));

  // Enable validation pipe globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }));

  // Enable CORS for frontend access
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
  Logger.log(`🚀 Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
