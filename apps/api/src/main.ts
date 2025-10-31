import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('port') as string;
  const globalPrefix = configService.get('apiPrefix') as string;

  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  app.use(cookieParser());

  await app.listen(port);
}

void bootstrap();
