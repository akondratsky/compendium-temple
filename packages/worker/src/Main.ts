import { inject, singleton } from 'tsyringe';
import { ConfigService, IConfigService } from './config';
import { AuthService, IAuthService } from './auth';


// import { ConfigService, IConfigService } from '@compendium-temple/config';
// import { ITaskRunnerService, TaskRunnerService } from '../services/taskRunner';


/**
 * Main class used to run worker
 */
@singleton()
export class Main {
  constructor(
    @inject(ConfigService) private config: IConfigService,
    @inject(AuthService) private auth: IAuthService,
  ) { }

  /**
   * Runs everything
   */
  public async start() {
    this.config.init();
    await this.auth.authorize();
  }
}
