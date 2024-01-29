import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

dayjs.extend(utc);

const API_PREFIX = 'api';
const port = process.env.BFF_PORT || 3042;

(async () => {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix(API_PREFIX);

  await app.listen(port);

  Logger.log(`BFF running on port ${port}; API prefix: ${API_PREFIX}`);
})();
