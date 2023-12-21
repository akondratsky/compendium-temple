import { inject, singleton } from 'tsyringe';
import { ConsoleManager } from 'console-gui-tools';

import { ConfigService } from '@compendium-temple/config';
import { EventEmitterService, WorkerEvent } from '../eventEmitter';
import { StatusPage, AbstractPage } from './pages';
import { AuthDialog } from './dialogs';


export interface IGuiService {
  render(): Promise<void>;
}

/**
 * Renders dashboard, logs etc
 */
@singleton()
export class GuiService implements IGuiService {
  private readonly gui: ConsoleManager;
  private page: AbstractPage | null = null;

  constructor(
    @inject(AuthDialog) private readonly authDialog: AuthDialog,
    @inject(ConfigService) private readonly config: ConfigService,
    @inject(EventEmitterService) private readonly eventEmitter: EventEmitterService,
  ) {
    this.gui = new ConsoleManager({
      title: 'Compendium Worker',
      logPageSize: 10,
    });
    this.eventEmitter.addListener(WorkerEvent.CloseAuthDialog, this.render.bind(this));
    this.eventEmitter.addListener(WorkerEvent.GuiLog, ({ level, message }) => {
      this.gui[level](message);
    });
  }

  public async render() {
    if (this.page) {
      this.page.unmount(this.gui);
    }
    this.page = new StatusPage({
      apiUrl: this.config.get().apiUrl,
      registryUrl: this.config.get().registryUrl,
    });

    this.page.mount(this.gui);
  }
}