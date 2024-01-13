import { inject, singleton } from 'tsyringe';
import { AuthService, IAuthService } from '../auth';
import { Octokit } from '@octokit/core';
import { MinimalRepository, RateLimit, SpdxSbom } from '@compendium-temple/api';
import { ResponseHeaders } from '@octokit/types';

export interface IGithubService {
  getRateLimit(): Promise<RateLimit>;
  listRepos(since: number): Promise<{ data: MinimalRepository[]; rateLimit: RateLimit }>;
  getRepo(owner: string, repo: string): Promise<{ data: MinimalRepository; rateLimit: RateLimit }>;
  getSpdxSbom(owner: string, repo: string): Promise<{ data: SpdxSbom; rateLimit: RateLimit }>;
}

export type GithubResponse<T> = Promise<{
  data: T;
  rateLimit: RateLimit;
}>


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

  public async listRepos(since: number): GithubResponse<MinimalRepository[]> {
    const { data, headers } = await this.octokit.request('GET /repositories', {
      since,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return {
      data: data as MinimalRepository[],
      rateLimit: this.getRateLimitFromHeaders(headers),
    };
  }

  public async getRepo(owner: string, repo: string): GithubResponse<MinimalRepository> {
    const { data, headers } = await this.octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return {
      data: data as MinimalRepository,
      rateLimit: this.getRateLimitFromHeaders(headers),
    }
  }

  public async getSpdxSbom(owner: string, repo: string): GithubResponse<SpdxSbom> {
    const { data, headers } = await this.octokit.request('GET /repos/{owner}/{repo}/dependency-graph/sbom', {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return {
      data: data as SpdxSbom,
      rateLimit: this.getRateLimitFromHeaders(headers),
    }
  }

  private getRateLimitFromHeaders(headers: ResponseHeaders): RateLimit {
    return {
      limit: parseInt(headers['x-ratelimit-limit'] as string),
      remaining: parseInt(headers['x-ratelimit-remaining'] as string),
      reset: parseInt(headers['x-ratelimit-reset'] as string),
      used: parseInt(headers['x-ratelimit-used'] as string),
    };
  }
}