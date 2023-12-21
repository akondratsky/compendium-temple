import { IGithubUserProvider } from '../githubUser.provider';

export class GithubUserProvider implements IGithubUserProvider {
  public upsert = jest.fn();
}
