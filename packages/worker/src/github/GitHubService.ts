import { inject, singleton } from 'tsyringe';
import { AuthService, IAuthService } from '../auth';
import { Octokit } from '@octokit/core';
import { MinimalRepository, RateLimit } from '@compendium-temple/api';

export interface IGithubService {
  getRateLimit(): Promise<RateLimit>;
  listRepos(since: number): Promise<MinimalRepository[]>;
}


@singleton()
export class GithubService implements IGithubService {
  private readonly octokit: Octokit;
  constructor(
    @inject(AuthService) private readonly auth: IAuthService,
  ) {
    this.octokit = new Octokit({
      auth: this.auth.token,
    });
  }

  public async getRateLimit(): Promise<RateLimit> {
    const { data } = await this.octokit.request('GET /rate_limit', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return data.rate;
  }

  public async listRepos(since: number): Promise<MinimalRepository[]> {
    const { data } = await this.octokit.request('GET /repositories', {
      since,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return data;
  }
}