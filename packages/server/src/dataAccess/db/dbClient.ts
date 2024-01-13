import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Database Prisma provider
 */
@Injectable()
export class DbClient extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(DbClient.name);

  public async onModuleInit() {
      await this.$connect();

      if (await this.missionState.findFirst() === null) {
        this.logger.warn('No global mission state found. Creating...');
        await this.missionState.create({
          data: {
            nextListTaskRepoId: 311525790,
          },
        });
      }
  }
}
