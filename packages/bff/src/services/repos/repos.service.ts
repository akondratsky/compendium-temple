import { Injectable } from '@nestjs/common';
import type { RepoSearchResult } from '@compendium-temple/api';
import { SearchReposParams } from '../../dto/SearchReposParams';
import { DbClient } from '../../dataAccess/db';
import { Prisma } from '@prisma/client';

export interface IReposService {
  search(params: SearchReposParams): Promise<RepoSearchResult>;
}

@Injectable()
export class ReposService implements IReposService {
  constructor(
    private readonly db: DbClient,
  ) { }

  async search(params: SearchReposParams): Promise<RepoSearchResult> {
    const conditions: Prisma.RepositoryWhereInput[] = [];


    if (params.packages.length) {
      conditions.push(...params.packages.map((id) => ({
        dependencies: {
          some: {
            package: { id },
          }
        }
      })))
    }

    if (params.language) {
      conditions.push({
        language: params.language,
      });
    }

    const where: Prisma.RepositoryWhereInput = {};

    if (conditions.length) {
      where.AND = conditions;
    }

    const [repos, total] = await Promise.all([
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
        where,
      }),
      this.db.repository.count({ where })
    ]);

    return { repos, total };
  }
}