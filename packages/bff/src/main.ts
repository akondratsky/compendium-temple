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
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(API_PREFIX);
  // app.use(json({ limit: '50mb' }));
  // app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  await app.listen(port);
  Logger.log(`🚀 BFF is running on: http://localhost:${port}/${API_PREFIX}`);
})();
