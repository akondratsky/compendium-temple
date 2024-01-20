import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

/**
 * Database Prisma provider
 */
@injectable()
export class DbClient extends PrismaClient {}
