import { listReposResponse } from './githubStubs/listReposResponse';
import { regularRepoResponse } from './githubStubs/regularRepoResponse';
import { templateRepoResponse } from './githubStubs/templateRepoResponse';

export const githubResponse = {
  listRepos: listReposResponse,
  getRepo: {
    regular: regularRepoResponse,
    template: templateRepoResponse,
  }
}