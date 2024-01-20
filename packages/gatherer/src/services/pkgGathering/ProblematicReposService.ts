import { inject, injectable } from 'tsyringe';
import { LoggerService } from '../LoggerService';
import { Repository } from '@prisma/client';
import { resolve } from 'path';
import { userInfo } from 'os';
import { appendFileSync } from 'fs';

@injectable()
export class ProblematicReposService {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  private readonly removedLogPath = resolve(userInfo().homedir, 'removed_repos.log');

  public async mark(repo: Repository, reason: string) {
    const message = `${repo.fullName}: ${reason}`;
    this.logger.warn(message);
    appendFileSync(this.removedLogPath, `${message}\n`);
  }
}