import { Injectable } from '@nestjs/common';
import type { RepoSearchResult } from '@compendium-temple/api';
import { SearchReposParams } from '../../dto/SearchReposParams';
import { Repository } from '@prisma/client';
import { DbClient } from '../../dataAccess/db';

export interface IReposService {
  search(params: SearchReposParams): Promise<Repository[]>;
}

@Injectable()
export class ReposService implements IReposService {
  constructor(
    private readonly db: DbClient,
  ) {}

  async search(params: SearchReposParams): Promise<RepoSearchResult[]> {
    return this.db.repository.findMany({
      take: 10,
      include: {
        owner: true,
        license: true,
        codeOfConduct: true,
      }
    });
  }
}