import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { AppModule } from './app.module';

let cachedApp: any = null;
const expressApp = express();

async function createNestApp() {
  if (!cachedApp) {
    const adapter = new ExpressAdapter(expressApp);
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
    const app = await NestFactory.create(AppModule, adapter);
    app.enableCors();
    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'client-lobby', 'client-source', 'client-trace'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3005);

  return app;
}

// Export for Vercel
export default async function handler(req: any, res: any) {
  await createNestApp();
  return expressApp(req, res);
}

// Run bootstrap only if not in Vercel
if (process.env.VERCEL !== '1') {
  bootstrap();
}