import {
  MinimalRepository,
  SimpleUser,
  License as LicenseResponse,
} from '../types';
import { GitHubUser, GithubUserType, License, Repository } from '@prisma/client';
import { RepoSearchResultItem } from './reposGathering/RepoService';
import { injectable } from 'tsyringe';

export interface IMapperUtil {
  userType(userType: string): GithubUserType;
  
  ownerToGithubUser(owner: SimpleUser): GitHubUser;
  license(license: MinimalRepository['license']): License | null;
  repository(repo: RepoSearchResultItem): Repository;
  
  nullableDate(date?: string | number): Date | null;
}

@injectable()
export class MapperUtil implements IMapperUtil {
  public nullableDate(date?: string | number | null): Date | null {
    return date ? new Date(date) : null;
  }

  public enabledStatus(status?: 'enabled' | 'disabled'): boolean | null {
    return status ? status === 'enabled' : null;
  }

  public ownerToGithubUser(owner: SimpleUser): GitHubUser {
    return {
      id: owner.id,
      login: owner.login,
      sourceUserId: 0,
      name: owner.name ?? null,
      avatarUrl: owner.avatar_url,
      htmlUrl: owner.html_url,
      type: this.userType(owner.type),
      siteAdmin: owner.site_admin,
      nodeId: owner.node_id,
      url: owner.url,
      email: owner.email || null,
      gravatarId: owner.gravatar_id,
      starredAt: owner.starred_at ? new Date(owner.starred_at) : null,
    };
  }

  public license(license: LicenseResponse): License {
    return {
      key: license.key,
      sourceUserId: 0,
      nodeId: license.node_id,
      name: license.name ?? null,
      url: license.url ?? null,
      spdxId: license.spdx_id ?? null,
    };
  }

  public userType(userType: string): GithubUserType {
    switch (userType) {
      case 'User':
        return GithubUserType.USER;
      case 'Organization':
        return GithubUserType.ORGANIZATION;
      case 'Bot':
        return GithubUserType.BOT;
      default:
        throw new Error(`Unknown user type: ${userType}`);
    }
  }

  public repository(repo: RepoSearchResultItem): Repository {
    return {
      id: repo.id,
      codeOfConductKey: null,
      isAdvancedSecurityEnabled: null,
      isDependabotSecurityUpdatesEnabled: null,
      isSecretsScanningEnabled: null,
      isSecretsScanningPushProtectionEnabled: null,
      sourceUserId: 0,
      nodeId: repo.node_id,
      name: repo.name,
      createdAt: this.nullableDate(repo.created_at),
      defaultBranch: repo.default_branch || null,
      description: repo.description,
      forksCount: repo.forks_count || null,
      fullName: repo.full_name,
      gitUrl: repo.git_url || null,
      hasDownloads: repo.has_downloads || null,
      hasIssues: repo.has_issues || null,
      hasPages: repo.has_pages || null,
      hasProjects: repo.has_projects || null,
      gitHubUserId: repo.owner?.id ?? null,
      htmlUrl: repo.html_url,
      hasDiscussions: repo.has_discussions || null,
      hasWiki: repo.has_wiki || null,
      homepage: repo.homepage || null,
      isDisabled: repo.disabled ?? null,
      isArchived: repo.archived ?? null,
      isTemplate: repo.is_template ?? null,
      isFork: repo.fork,
      isForkingAllowed: repo.allow_forking ?? null,
      language: repo.language || null,
      licenseKey: repo.license?.key || null,
      openIssuesCount: repo.open_issues_count || null,
      pushedAt: this.nullableDate(repo.pushed_at),
      size: repo.size || null,
      stargazersCount: repo.stargazers_count || null,
      updatedAt: this.nullableDate(repo.updated_at),
      url: repo.url,
      subscribersCount: null,
      watchersCount: repo.watchers_count || null,
    }
  }
}
