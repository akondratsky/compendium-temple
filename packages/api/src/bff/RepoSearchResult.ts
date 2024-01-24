import { CodeOfConduct, GitHubUser, License, Repository } from '@prisma/client'

export type RepoSearchResultItem = Repository & {
  owner: GitHubUser | null;
  license: License | null;
  codeOfConduct: CodeOfConduct | null;
};

export type RepoSearchResult = {
  repos: RepoSearchResultItem[];
  total: number;
}