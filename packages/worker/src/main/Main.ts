import { inject, singleton } from 'tsyringe';
import { ConfigService, IConfigService } from '../services/config';


// import { ConfigService, IConfigService } from '@compendium-temple/config';
// import { AuthService, IAuthService } from '../services/auth';
// import { GuiService, IGuiService } from '../services/gui';
// import { ITaskRunnerService, TaskRunnerService } from '../services/taskRunner';


/**
 * Main class used to run worker
 */
@singleton()
export class Main {
  constructor(
    @inject(ConfigService) private config: IConfigService,
    // @inject(AuthService) private authService: IAuthService,
    // @inject(GuiService) private gui: IGuiService,
    // @inject(TaskRunnerService) private readonly taskRunner: ITaskRunnerService,
  ) { }

  /**
   * Runs everything
   */
  public async start() {
    this.config.init();
    // await this.gui.render();
    // await this.authService.authorize();
    // await this.taskRunner.run();
  }
}
