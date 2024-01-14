import { inject, singleton } from 'tsyringe';
import { ConfigService, IConfigService } from './config';
import { AuthService, IAuthService } from './auth';
import { TaskRunnerService, ITaskRunnerService } from './taskRunner';

/**
 * Main class used to run worker
 */
@singleton()
export class Main {
  constructor(
    @inject(ConfigService) private config: IConfigService,
    @inject(AuthService) private auth: IAuthService,
    @inject(TaskRunnerService) private taskRunner: ITaskRunnerService,
  ) { }

  /**
   * Runs everything
   */
  public async start() {
    await this.config.init();
    await this.auth.authorize();
    await this.taskRunner.run();
  }
}
