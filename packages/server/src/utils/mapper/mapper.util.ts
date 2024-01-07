import {
  CodeOfConduct as CodeOfConductResponse,
  MinimalRepository,
  SimpleUser,
  License as LicenseResponse,
} from '@compendium-temple/api';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CodeOfConduct, GitHubUser, GithubUserType, License, Repository } from '@prisma/client';

export interface IMapperUtil {
  userType(userType: string): GithubUserType;
  
  ownerToGithubUser(owner: SimpleUser, sourceUserId: number): GitHubUser;
  license(license: MinimalRepository['license'], sourceUserId: number): License | null;
  codeOfConduct(codeOfConduct: CodeOfConductResponse, sourceUserId: number): CodeOfConduct;
  repository(repo: MinimalRepository, sourceUserId: number): Repository;
  
  nullableDate(date?: string | number): Date | null;
}

@Injectable()
export class MapperUtil implements IMapperUtil {
  private readonly logger = new Logger(MapperUtil.name);

  public nullableDate(date?: string | number | null): Date | null {
    return date ? new Date(date) : null;
  }

  public enabledStatus(status?: 'enabled' | 'disabled'): boolean | null {
    return status ? status === 'enabled' : null;
  }

  public ownerToGithubUser(owner: SimpleUser, sourceUserId: number): GitHubUser {
    return {
      id: owner.id,
      sourceUserId,
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

  public license(license: LicenseResponse, sourceUserId: number): License {
    return {
      key: license.key,
      sourceUserId,
      nodeId: license.node_id,
      name: license.name ?? null,
      url: license.url ?? null,
      spdxId: license.spdx_id ?? null,
    };
  }

  public codeOfConduct(codeOfConduct: CodeOfConductResponse, sourceUserId: number): CodeOfConduct {
    return {
      key: codeOfConduct.key,
      sourceUserId,
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
        this.logger.error(`Unknown user type: ${userType}`);
        throw new InternalServerErrorException();
    }
  }

  public repository(repo: MinimalRepository, sourceUserId: number): Repository {
    return {
      id: repo.id,
      sourceUserId,
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
      gitHubUserId: repo.owner?.id ?? null,
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
