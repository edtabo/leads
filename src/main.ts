import 'dotenv/config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { AppModule } from './app.module';

const expressApp = express();

async function createNestApp() {
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  app.setGlobalPrefix('api');
  app.enableCors({
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.init();
  return app;
}

// Export handler for Vercel
export default async function (req: any, res: any) {
  const app = await createNestApp();
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.getInstance().use(expressApp);
  return httpAdapter.getInstance()(req, res);
}