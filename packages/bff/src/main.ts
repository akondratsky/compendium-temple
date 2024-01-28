import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

dayjs.extend(utc);

const API_PREFIX = 'api';
const port = process.env.BFF_PORT || 3042;

(async () => {
  const isHttps = Boolean(process.env.SSL_PUBLIC_CERT && process.env.SSL_PRIVATE_KEY);
  const httpsOptions: HttpsOptions | undefined = isHttps ? {
    key: process.env.SSL_PRIVATE_KEY,
    cert: process.env.SSL_PUBLIC_CERT,
  } : undefined

  const app = await NestFactory.create(AppModule, {
    cors: true,
    httpsOptions,
  });

  app.setGlobalPrefix(API_PREFIX);

  await app.listen(port);
  Logger.log(`🚀 BFF is running on: http://localhost:${port}/${API_PREFIX}`);
})();
