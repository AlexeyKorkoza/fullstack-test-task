import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from '@/core/filters/http-exception.filter';
import { type AppConfig } from '@/core/interfaces';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService<AppConfig>);
  const port = configService.get<number>('port', { infer: true });
  const globalPrefix = configService.get<string>('apiPrefix', { infer: true });
  const corsOrigin = configService.get<string>('cors.origin', { infer: true });

  app.setGlobalPrefix(globalPrefix);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API endpoints documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = `${globalPrefix}/docs`;
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/${swaggerPath}`);
}

void bootstrap();
