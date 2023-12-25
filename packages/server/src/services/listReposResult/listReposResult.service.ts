import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import {
  MinimalRepository,
} from '@compendium-temple/api';
import { uniqBy } from 'lodash';
import { MapperUtil } from '../../utils/mapper';
import { DbClient } from '../../dataAccess/db';

export interface IListReposResultService {
  save(repos: MinimalRepository[]): Promise<void>;
}

@Injectable()
export class ListReposResultService implements IListReposResultService {
  constructor(
    private readonly db: DbClient,
    private readonly mapper: MapperUtil,
  ) { }

  private readonly logger = new Logger(ListReposResultService.name);

  /**
   * Saves owners, code of conducts, licenses and repositories from GitHub API response
   */
  public async save(repos: MinimalRepository[]): Promise<void> {
    try {
      const owners = uniqBy(
        repos.map(({ owner }) => this.mapper.ownerToGithubUser(owner)),
        'id'
      );

      this.logger.debug(`Saving list repos result... Repos: ${repos.length} Owners: ${owners.length}`);

      await Promise.all([
        ...owners.map((owner) => this.db.gitHubUser.upsert({
          where: { id: owner.id },
          create: owner,
          update: owner,
        })),
      ]);

      await Promise.all(repos
        .map((repo) => this.mapper.minimalRepository(repo))
        .map((repo) => this.db.repository.upsert({
          where: { id: repo.id },
          create: repo,
          update: repo,
        })),
      );
    } catch (e) {
      this.logger.error(`Error saving list repos result: ${(e as Error).message}`);
      throw new InternalServerErrorException();
    }
  }
}