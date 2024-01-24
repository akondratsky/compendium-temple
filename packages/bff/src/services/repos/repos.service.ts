import { Injectable } from '@nestjs/common';
import type { RepoSearchResult, RepoSearchResultItem } from '@compendium-temple/api';
import { SearchReposParams } from '../../dto/SearchReposParams';
import { DbClient } from '../../dataAccess/db';

export interface IReposService {
  search(params: SearchReposParams): Promise<RepoSearchResult>;
}

@Injectable()
export class ReposService implements IReposService {
  constructor(
    private readonly db: DbClient,
  ) {}

  async search(params: SearchReposParams): Promise<RepoSearchResult> {
    const [ repos, total ] = await Promise.all([
      this.db.repository.findMany({
        take: params.pageSize,
        skip: (params.page - 1) * params.pageSize,
        include: {
          owner: true,
          license: true,
          codeOfConduct: true,
        },
        where: {
          language: params.language ?? undefined,
        }
      }),
      this.db.repository.count({
        where: {
          language: params.language ?? undefined,
        },
      })
    ]);

    return { repos, total };
  }
}