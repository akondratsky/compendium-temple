import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { GitHubUser } from '@prisma/client';
import { MapperUtil } from '../../utils/mapper';

export interface IOctokitClient {
  getAuthenticatedUser(token: string): Promise<GitHubUser>;
}

@Injectable()
export class OctokitClient implements IOctokitClient {
  constructor(
    private readonly mapper: MapperUtil,
  ) { }
  /**
   * @param token GitHub API token
   * @returns GitHub User Response
   */
  public async getAuthenticatedUser(token: string): Promise<GitHubUser> {
    const octokit = new Octokit({
      auth: token,
    });

    try {
      const { data } = await octokit.users.getAuthenticated();

      return {
        sourceUserId: data.id,
        avatarUrl: data.avatar_url,
        email: data.email,
        gravatarId: data.gravatar_id,
        htmlUrl: data.html_url,
        id: data.id,
        login: data.login,
        name: data.name,
        nodeId: data.node_id,
        type: this.mapper.userType(data.type),
        siteAdmin: data.site_admin,
        url: data.url,
        starredAt: null,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}