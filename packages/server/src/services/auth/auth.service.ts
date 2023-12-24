import { Inject, Injectable, InternalServerErrorException, Logger, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import type { Request } from 'express';
import type { CompendiumUser, GitHubUser } from '@prisma/client';

import { GithubUserProvider } from '../../providers/githubUser';
import { HashUtil } from '../../utils/hash';
import { OctokitClient } from '../../dataAccess/octokit';
import { CompendiumUserProvider } from '../../providers/compendiumUser';

export interface IAuthService {
  authenticate(): Promise<boolean>;
  getCurrentUser(): CompendiumUser;
  getCurrentUserId(): number;
}


@Injectable({ scope: Scope.REQUEST })
export class AuthService implements IAuthService {
  private token: string;
  private currentUser?: CompendiumUser;

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly githubUser: GithubUserProvider,
    private readonly compendiumUser: CompendiumUserProvider,
    private readonly hash: HashUtil,
    private readonly octokit: OctokitClient,
  ) {
    this.token = request.header('authorization') as string;
  }

  public getCurrentUser() {
    if (!this.currentUser) {
      Logger.error('Current user was not initialized');
      throw new InternalServerErrorException('Current user not found');
    }
    return this.currentUser;
  }

  public getCurrentUserId() {
    return this.getCurrentUser().id;
  }

  /**
   * Searches in DB for a user by token, and if user record (or token) not found - creates it
   */
  public async authenticate(): Promise<boolean> {
    const hash = await this.hash.calc(this.token);
    
    Logger.debug(`Authenticating with token ${this.token}`);
    const compendiumUser = await this.compendiumUser.getByHash(hash);
    Logger.debug(`Found user: ${compendiumUser?.id}`);

    if (compendiumUser) {
      this.currentUser = compendiumUser;
      return true;
    }

    let githubUser: GitHubUser;
    try {
      Logger.debug(`Fetching GitHub user with token: ${this.token}`);
      githubUser = await this.octokit.getAuthenticatedUser(this.token);
      Logger.debug(`Fetched GitHub user: ${githubUser.id}`);
    } catch (e) {
      Logger.error(`Error fetching GitHub user: ${(e as Error).message}`);
      throw new UnauthorizedException();
    }

    this.currentUser = {
      id: githubUser.id,
      login: githubUser.login,
      hash,
    };

    try {
      await Promise.all([
        this.githubUser.upsert(githubUser),
        this.compendiumUser.upsert(this.currentUser),
      ]);
      Logger.debug(`Upserted user: ${this.currentUser.id}`);
    } catch (e) {
      Logger.error(`Error upserting user: ${(e as Error).message}`);
      throw new InternalServerErrorException(e);
    }

    return true;
  }
}
