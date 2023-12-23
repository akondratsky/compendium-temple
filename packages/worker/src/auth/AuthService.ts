import { inject, singleton } from 'tsyringe';
import { getPassword, setPassword } from 'keytar';
import dedent from 'dedent';
import { userInfo } from 'os';
import opener from 'opener';
import clipboardy from 'clipboardy-ts';

import { createOAuthDeviceAuth } from '@octokit/auth-oauth-device';
import { LoggerService } from '../logger';
import { UiService } from '../ui';

export interface IAuthService {
  authorize(): Promise<void>;
  get token(): string;
}

/**
 * Service responsible for the OAuth authorization and its token
 */
@singleton()
export class AuthService implements IAuthService {
  private readonly SERVICE_NAME = '@compendium-temple/worker/serverToken';
  private readonly ACCOUNT_NAME = userInfo().username;
  private _accessToken: string | null = null;

  constructor(
    @inject(LoggerService) private logger: LoggerService,
    @inject(UiService) private ui: UiService,
  ) {}

  /**
   * Gets the access token and login if required
   */
  public async authorize(): Promise<void> {
    this._accessToken = await getPassword(this.SERVICE_NAME, this.ACCOUNT_NAME);

    if (this._accessToken !== null) {
      this.logger.debug('User has already authorized');
      return;
    }

    this.logger.info('Authorization is required. Requesting a code...');

    const auth = createOAuthDeviceAuth({
      clientType: 'oauth-app',
      clientId: 'b65a9ea307e51ff1f344',
      scopes: ['public_repo', 'user'],
      onVerification: ({ verification_uri, user_code }) => {
        clipboardy.writeSync(user_code);

        this.logger.info(dedent(`
          The code is copied into clipboard: ${user_code}
          In case browser does not open, please follow the link manually:
          ${verification_uri}

          Press any key to open the browser
        `));

        this.ui.pressAnyKey()
          .then(() => {
            opener(verification_uri);
            this.logger.info('Browser was opened, waiting for the authorization...');
          });
      },
    });
    const { token } = await auth({ type: 'oauth' });
    this._accessToken = token;
    this.logger.info('User authorized')
    await setPassword(this.SERVICE_NAME, this.ACCOUNT_NAME, token);
    this.logger.debug('Token was added to the local key vault');
  }

  public get token() {
    if (!this._accessToken) {
      throw new Error('Authorization error');
    }
    return this._accessToken;
  }
}