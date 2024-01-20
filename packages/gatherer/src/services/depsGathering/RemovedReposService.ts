import { inject, injectable } from 'tsyringe';
import { LoggerService } from '../LoggerService';
import { DbClient } from '../../dbClient';
import { Repository } from '@prisma/client';
import { resolve } from 'path';
import { userInfo } from 'os';
import { appendFileSync } from 'fs';

@injectable()
export class RemovedReposService {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(DbClient) private readonly db: DbClient,
  ) {}

  private readonly removedLogPath = resolve(userInfo().homedir, 'removed_repos.log');

  public async removeRepo(repo: Repository) {
    this.logger.warn(`${repo.fullName} does not have SBOM, removing...`);
    appendFileSync(this.removedLogPath, `${repo.fullName}\n`);
    await this.db.repository.delete({
      where: {
        id: repo.id,
      }
    });
  }
}