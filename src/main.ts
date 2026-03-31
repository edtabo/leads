import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { AppModule } from './app.module';

const expressApp = express();
let cachedApp: any = null;

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

// For local development
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
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
