import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { readFileSync } from 'node:fs';

import { AppModule } from './app.module';

dayjs.extend(utc);

const API_PREFIX = 'api';
const port = process.env.BFF_PORT || 3042;

(async () => {
  const isHttps = Boolean(process.env.SSL_PUBLIC_CERT_PATH && process.env.SSL_PRIVATE_KEY_PATH);
  const httpsOptions: HttpsOptions | undefined = isHttps ? {
    key: readFileSync(process.env.SSL_PRIVATE_KEY_PATH as string, 'utf-8'),
    cert: readFileSync(process.env.SSL_PUBLIC_CERT_PATH as string, 'utf-8'),
  } : undefined

  const app = await NestFactory.create(AppModule, {
    cors: true,
    httpsOptions,
  });

  app.setGlobalPrefix(API_PREFIX);

  await app.listen(port);
  Logger.log(`🚀 BFF is running on: http://localhost:${port}/${API_PREFIX}`);
})();
