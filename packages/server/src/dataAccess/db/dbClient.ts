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
            // the most old repo found in search is 3406729:
            // https://github.com/search?q=language%3AJavaScript++template%3Atrue&type=repositories&s=updated&o=asc
            nextListTaskRepoId: 3406728,
          },
        });
      }
  }
}
