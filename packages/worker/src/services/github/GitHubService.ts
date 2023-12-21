import { inject, singleton } from 'tsyringe';
import { userInfo } from 'os';
import { getPassword } from 'keytar';
import { EventEmitterService, IEventEmitterService, WorkerEvent } from '../eventEmitter';
// import { Octokit } from '@octokit/core';

export interface IGithubService {
  getRateLimit(): Promise<unknown>;
}

@singleton()
export class GithubService implements IGithubService {
  private readonly SERVICE_NAME = '@compendium-temple/worker/githubToken';
  private readonly ACCOUNT_NAME = userInfo().username;
  private token: string | null = null;

  constructor(
    @inject(EventEmitterService) private readonly eventEmitter: IEventEmitterService,
  ){
    getPassword(this.SERVICE_NAME, this.ACCOUNT_NAME).then((token) => {
      if (token) {
        this.token = token;
        this.eventEmitter.emit(WorkerEvent.GithubAuthorization);
      }
    });
  }

  private ensureToken() {
    if (!this.token) {
      throw new Error('Internal error: GitHub token was not set');
    }
  }

  public async getRateLimit(): Promise<unknown> {
    this.ensureToken();
    return {};
  }
}