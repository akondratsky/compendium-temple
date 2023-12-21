import { CompendiumUser } from '@prisma/client';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  /** Get by GitHub token hash */
  public async getByHash(hash: string): Promise<CompendiumUser | null> {
    try {
      return this.db.compendiumUser.findFirst({
        where: { hash }
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
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
      throw new InternalServerErrorException(e);
    }
  }
}