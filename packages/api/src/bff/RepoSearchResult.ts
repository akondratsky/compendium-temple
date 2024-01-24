import { GitHubUser, License, Repository } from '@prisma/client'

type RepoFields = 'id'
  | 'fullName'
  | 'description'
  | 'language'
  | 'htmlUrl'
  | 'stargazersCount'
  | 'forksCount'
  | 'watchersCount'
  | 'openIssuesCount'
  | 'isDisabled'
  | 'isFork'
  | 'hasIssues'
  | 'hasProjects'
  | 'hasWiki'
  | 'hasPages'
  | 'hasDownloads'
  | 'hasDiscussions'
  | 'isArchived'
  | 'isForkingAllowed'
  | 'createdAt'
  | 'updatedAt'
  | 'pushedAt';

type OwnerFields = 'id' | 'login' | 'avatarUrl' | 'htmlUrl';

type LicenseFields = 'name';

export type RepoSearchResultItem = Pick<Repository, RepoFields> & {
  owner: Pick<GitHubUser, OwnerFields> | null;
  license: Pick<License, LicenseFields> | null;
  dependencies: {
    package: {
      id: number;
      name: string;
    };
  }[],
};

export type RepoSearchResult = {
  repos: RepoSearchResultItem[];
  total: number;
}