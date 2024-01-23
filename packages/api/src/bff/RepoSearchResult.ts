import { CodeOfConduct, GitHubUser, License, Repository } from '@prisma/client'

export type RepoSearchResult = Repository & {
  owner: GitHubUser | null;
  license: License | null;
  codeOfConduct: CodeOfConduct | null;
};
