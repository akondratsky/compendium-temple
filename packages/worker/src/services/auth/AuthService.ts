import { inject, singleton } from 'tsyringe';
import { getPassword, setPassword } from 'keytar';
import dedent from 'dedent';
import { userInfo } from 'os';
import opener from 'opener';
import clipboardy from 'clipboardy-ts';

import { createOAuthDeviceAuth } from '@octokit/auth-oauth-device';
import { LoggerService } from '../logger';
import { EventEmitterService, WorkerEvent } from '../eventEmitter';

export interface IAuthService {
  authorize(): Promise<void>;
  getAccessToken(): string;
}

/**
 * Service responsible for the OAuth authorization and its token
 */
@singleton()
export class AuthService implements IAuthService {
  private readonly SERVICE_NAME = '@compendium-temple/worker/serverToken';
  private readonly ACCOUNT_NAME = userInfo().username;
  private accessToken: string | null = null;

  constructor(
    @inject(LoggerService) private logger: LoggerService,
    @inject(EventEmitterService) private readonly eventEmitter: EventEmitterService,
  ) {}

  /**
   * Gets the access token and login if required
   */
  public async authorize(): Promise<void> {
    this.accessToken = await getPassword(this.SERVICE_NAME, this.ACCOUNT_NAME);

    if (this.accessToken !== null) {
      this.logger.log('User has already authorized');
      return;
    }

    this.logger.log('Authorization is required. Requesting a code...');

    const auth = createOAuthDeviceAuth({
      clientType: 'oauth-app',
      clientId: 'b65a9ea307e51ff1f344',
      scopes: ['public_repo', 'user'],
      onVerification: ({ verification_uri, user_code }) => {
        this.logger.log(dedent(`
          The code is copied into clipboard: ${user_code}
          In case browser does not open, please follow the link manually:
          ${verification_uri}
        `));
        clipboardy.writeSync(user_code);
        this.eventEmitter.emit(WorkerEvent.OpenAuthDialog, {
          url: verification_uri,
          code: user_code,
        });
        setTimeout(() => {
          this.logger.log('Opening browser...');
          opener(verification_uri);
        }, 3000); 
      },
    });

    this.logger.log('Waiting for the authorization...');

    const oauthAuthentication = await auth({
      type: 'oauth',
    });

    this.accessToken = oauthAuthentication.token;

    this.logger.log('Authorized, saving access token to the local key vault...')

    await setPassword(this.SERVICE_NAME, this.ACCOUNT_NAME, this.accessToken);

    this.logger.log('Token was added to the local key vault.');

    this.eventEmitter.emit(WorkerEvent.CloseAuthDialog);
  }


  public getAccessToken() {
    if (!this.accessToken) {
      throw new Error('Authorization error');
    }
    return this.accessToken;
  }
}