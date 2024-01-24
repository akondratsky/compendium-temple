import { Injectable } from '@nestjs/common';
import type { RepoSearchResult } from '@compendium-temple/api';
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

        select: {
          id: true,
          fullName: true,
          description: true,
          language: true,
          htmlUrl: true,

          owner: {
            select: {
              id: true,
              login: true,
              avatarUrl: true,
              htmlUrl: true,
            },
          },
          license: {
            select: {
              name: true,
            }
          },
          dependencies: {
            select: {
              package: {
                select: {
                  id: true,
                  name: true,
                }
              },
            },
          },
        },
        where: {
          language: params.language ?? undefined,
        },
      }),

      this.db.repository.count({
        where: {
          language: params.language ?? undefined,
          AND: params.packages.map((packageId) => ({
            dependencies: {
              some: {
                id: packageId,
              },
            },
          })),
        },
      })
    ]);

    return { repos, total };
  }
}