import { MinimalRepository } from '@compendium-temple/api';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DbClient } from '../../dataAccess/db';
import { MapperUtil } from '../../utils/mapper';
import { AuthService } from '../auth';

export interface IDetailRepoResultService {
  save(repo: MinimalRepository): Promise<void>;
}

@Injectable()
export class DetailRepoResultService implements IDetailRepoResultService {
  constructor(
    private readonly db: DbClient,
    private readonly mapper: MapperUtil,
    private readonly auth: AuthService,
  ) {}

  private readonly logger = new Logger(DetailRepoResultService.name);

  public async save(repo: MinimalRepository): Promise<void> {
    const userId = this.auth.getCurrentUserId();

    try {
      if (repo.code_of_conduct?.key) await this.db.codeOfConduct.upsert({
        where: { key: repo.code_of_conduct.key },
        create: this.mapper.codeOfConduct(repo.code_of_conduct, userId),
        update: this.mapper.codeOfConduct(repo.code_of_conduct, userId),
      });
    } catch (e) {
      this.logger.error(`Error saving code of conduct: ${(e as Error).message}`);
      throw new InternalServerErrorException();
    }

    try {
      if (repo.license?.key) await this.db.license.upsert({
        where: { key: repo.license.key },
        create: this.mapper.license(repo.license, userId),
        update: this.mapper.license(repo.license, userId),
      });
    } catch (e) {
      this.logger.error(`Error saving license: ${(e as Error).message}`);
      throw new InternalServerErrorException();
    }

    try {
      await this.db.gitHubUser.upsert({
        where: { id: repo.owner.id },
        create: this.mapper.ownerToGithubUser(repo.owner, userId),
        update: this.mapper.ownerToGithubUser(repo.owner, userId),
      });
    } catch (e) {
      this.logger.error(`Error saving github user: ${(e as Error).message}`);
      throw new InternalServerErrorException();
    }

    try {
      await this.db.repository.upsert({
        where: { id: repo.id },
        create: this.mapper.repository(repo, userId),
        update: this.mapper.repository(repo, userId),
      });
    } catch (e) {
      this.logger.error(`Error saving repository: ${(e as Error).message}`);
      throw new InternalServerErrorException();
    }
  }
}