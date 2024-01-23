import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Database Prisma provider
 */
@Injectable()
export class DbClient extends PrismaClient {}
