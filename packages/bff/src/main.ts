import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import { urlencoded, json } from 'express';
import { AppModule } from './app.module';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const API_PREFIX = 'api';
const port = process.env.BFF_PORT || 3042;

(async () => {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(API_PREFIX);
  
  await app.listen(port);
  Logger.log(`🚀 BFF is running on: http://localhost:${port}/${API_PREFIX}`);
})();
