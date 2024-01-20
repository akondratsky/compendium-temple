import { inject, injectable } from 'tsyringe';
import type { SearchService } from './SearchService';
import { DbClient } from '../../dbClient';
import { MapperUtil } from '../MapperUtil';
import { License } from '../../types';
import { LoggerService } from '../LoggerService';

export type RepoSearchResultItem = Awaited<ReturnType<SearchService['search']>>['items'][0];

@injectable()
export class RepoService {
  constructor(
    @inject(DbClient) private readonly db: DbClient,
    @inject(MapperUtil) private readonly mapper: MapperUtil,
    @inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  public async saveSearchResult(repos: RepoSearchResultItem[]) {
    this.logger.log(`saving ${repos.length} repos`);
    await Promise.all(repos.map(repo => this.saveRepo(repo)));
  }

  public async getReposCount() {
    return this.db.repository.count();
  }

  public async getRepoByOffset(offset: number) {
    return await this.db.repository.findFirst({
      skip: offset,
      include: {
        owner: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  private async saveRepo(repo: RepoSearchResultItem) {
    // wtf is this
    if (!repo.owner) return;

    try {
      if (repo.license?.key) await this.db.license.upsert({
        where: { key: repo.license.key },
        create: this.mapper.license(repo.license as License),
        update: this.mapper.license(repo.license as License),
      });
    } catch (e) {
      throw new Error(`Error saving license: ${(e as Error).message}`);
    }

    try {
      await this.db.gitHubUser.upsert({
        where: { id: repo.owner?.id },
        create: this.mapper.ownerToGithubUser(repo.owner),
        update: this.mapper.ownerToGithubUser(repo.owner),
      });
    } catch (e) {
      throw new Error(`Error saving github user: ${(e as Error).message}`);
    }

    try {
      await this.db.repository.upsert({
        where: { id: repo.id },
        create: this.mapper.repository(repo),
        update: this.mapper.repository(repo),
      });
    } catch (e) {
      throw new Error(`Error saving repository: ${(e as Error).message}`);
    }
  }


}