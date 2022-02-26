import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as basicAuth from 'express-basic-auth';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    ['/api/docs', '/api/docs/*'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.DOCS_AUTH_USERNAME]: process.env.DOCS_AUTH_PASSWORD,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Events Api')
    .setDescription('Event Api Documentation')
    .setVersion('1.0')
    .addTag('events')
    .addTag('cats')
    .addTag('auth')
    .addTag('users')
    .addCookieAuth('Authentication')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.set('etag', 'strong');

  app.use(cookieParser());
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
