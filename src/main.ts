import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get('ORIGIN'),
    credentials: true,
    exposedHeaders: 'set-cookie',
  });
  app.setGlobalPrefix('/api');

  await app.listen(3001);
}
bootstrap();
