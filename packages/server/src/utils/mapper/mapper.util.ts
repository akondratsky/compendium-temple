import {
  CodeOfConduct as CodeOfConductResponse,
  MinimalRepository,
  SimpleUser,
  License as LicenseResponse,
} from '@compendium-temple/api';
import { InternalServerErrorException } from '@nestjs/common';
import { CodeOfConduct, GitHubUser, GithubUserType, License, Repository } from '@prisma/client';

export interface IMapperUtil {
  ownerToGithubUser(owner: SimpleUser): GitHubUser;
  codeOfConduct(codeOfConduct: CodeOfConductResponse): CodeOfConduct;
  userType(userType: string): GithubUserType;
  license(license: MinimalRepository['license']): License | null;
  repository(repo: MinimalRepository): Repository;
  nullableDate(date?: string | number): Date | null;
}

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
      nodeId: license.node_id,
      name: license.name ?? null,
      url: license.url ?? null,
      spdxId: license.spdx_id ?? null,
    };
  }

  public codeOfConduct(codeOfConduct: CodeOfConductResponse): CodeOfConduct {
    return {
      key: codeOfConduct.key,
      name: codeOfConduct.name,
      url: codeOfConduct.url,
      body: codeOfConduct.body || null,
      htmlUrl: codeOfConduct.html_url,
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
        throw new InternalServerErrorException(`Unknown user type: ${userType}`);
    }
  }

  public repository(repo: MinimalRepository): Repository {
    return {
      id: repo.id,
      nodeId: repo.node_id,
      name: repo.name,
      codeOfConductKey: repo.code_of_conduct?.key || null,
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
      gitHubUserId: repo.owner.id,
      htmlUrl: repo.html_url,
      hasDiscussions: repo.has_discussions || null,
      hasWiki: repo.has_wiki || null,
      homepage: repo.homepage || null,
      isDisabled: repo.disabled ?? null,
      isArchived: repo.archived ?? null,
      isAdvancedSecurityEnabled: this.enabledStatus(repo.security_and_analysis?.advanced_security?.status),
      isDependabotSecurityUpdatesEnabled: this.enabledStatus(
        repo.security_and_analysis?.dependabot_security_updates?.status
      ),
      isTemplate: repo.is_template ?? null,
      isFork: repo.fork,
      isForkingAllowed: repo.allow_forking ?? null,
      isSecretsScanningEnabled: this.enabledStatus(repo.security_and_analysis?.secret_scanning?.status),
      isSecretsScanningPushProtectionEnabled: this.enabledStatus(
        repo.security_and_analysis?.secret_scanning_push_protection?.status,
      ),
      language: repo.language || null,
      licenseKey: repo.license?.key || null,
      openIssuesCount: repo.open_issues_count || null,
      pushedAt: this.nullableDate(repo.pushed_at),
      size: repo.size || null,
      stargazersCount: repo.stargazers_count || null,
      subscribersCount: repo.subscribers_count || null,
      updatedAt: this.nullableDate(repo.updated_at),
      url: repo.url,
      watchersCount: repo.watchers_count || null,
    }
  }

}
