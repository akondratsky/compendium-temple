import { Injectable } from '@nestjs/common';
import { GitHubUser } from '@prisma/client';
import { DbClient } from '../../dataAccess/db';

export interface IGithubUserProvider {
  upsert(user: GitHubUser): Promise<void>;
}

@Injectable()
export class GithubUserProvider implements IGithubUserProvider {
  constructor(
    private readonly db: DbClient,
  ) {}

  /**
   * Save or create GitHubUser in database
   */
  public async upsert(user: GitHubUser): Promise<void> {
    await this.db.gitHubUser.upsert({
      where: { id: user.id },
      create: user,
      update: user,
    });
  }
}