import { CompendiumUser } from '@prisma/client';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DbClient } from '../../dataAccess/db';

export interface ICompendiumUserProvider {
  getByHash(hash: string): Promise<CompendiumUser | null>;
  upsert(user: CompendiumUser): Promise<void>;
};

/**
 * Manages list of Compendium Template citizens
 */
@Injectable()
export class CompendiumUserProvider implements ICompendiumUserProvider {
  constructor(
    private readonly db: DbClient,
  ) { }

  private readonly logger = new Logger(CompendiumUserProvider.name);

  /** Get by GitHub token hash */
  public async getByHash(hash: string): Promise<CompendiumUser | null> {
    try {
      this.logger.debug(`Looking for user by hash ${hash}`);
      return this.db.compendiumUser.findFirst({
        where: { hash }
      });
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
  }

  /** Create or update by ID */
  public async upsert(user: CompendiumUser): Promise<void> {
    try {
      await this.db.compendiumUser.upsert({
        where: { id: user.id },
        create: user,
        update: user,
      });
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
  }
}