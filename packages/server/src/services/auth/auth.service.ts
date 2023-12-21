import { Inject, Injectable, InternalServerErrorException, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import type { Request } from 'express';
import type { CompendiumUser, GitHubUser } from '@prisma/client';

import { GithubUserProvider } from '../../providers/githubUser';
import { HashService } from '../hash';
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
    private readonly hash: HashService,
    private readonly octokit: OctokitClient,
  ) {
    this.token = request.header('authorization') as string;
  }

  public getCurrentUser() {
    if (!this.currentUser) {
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
    let compendiumUser: CompendiumUser | null;
    
    compendiumUser = await this.compendiumUser.getByHash(
      await this.hash.calc(this.token),
    );

    if (compendiumUser) {
      this.currentUser = compendiumUser;
      return true;
    }

    let githubUser: GitHubUser;
    try {
      githubUser = await this.octokit.getAuthenticatedUser(this.token);
    } catch (e) {
      throw new UnauthorizedException();
    }

    compendiumUser = {
      id: githubUser.id,
      login: githubUser.login,
      hash: await this.hash.calc(this.token),
    };

    await Promise.all([
      this.githubUser.upsert(githubUser),
      this.compendiumUser.upsert(compendiumUser),
    ]);

    return true;
  }
}
