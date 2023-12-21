import { ConfirmPopup, ConsoleManager } from 'console-gui-tools';
import { container } from 'tsyringe';
import { EventEmitterService, WorkerEvent } from '../../eventEmitter';
import { AbstractPage } from './AbstractPage';

export type StatusData = {
  registryUrl: string;
  apiUrl: string;
}

export class StatusPage extends AbstractPage {
  private readonly eventEmitter = container.resolve(EventEmitterService);

  constructor(data: StatusData) {
    super();

    this.addRow({ text: ' registry: ', bold: true }, { text: data.registryUrl });
    this.addRow({ text: ' api:      ', bold: true }, { text: data.apiUrl });

    this.addSpacer(2);

    this.addRow({ text: ' Hotkeys', color: 'gray' });
    this.addRow(
      { text: '   "q"', color: 'gray', bold: true },
      { text: '    - Quit' },
    );

    this.addSpacer();
  }

  protected override _mount(gui: ConsoleManager): void {
    console.log('MOUNT');
    gui.addListener('keypressed', this.keyboardHandler.bind(this));
  }

  protected override _unmount(gui: ConsoleManager): void {
    console.log('UNMOUNT');
    gui.removeListener('keypressed', this.keyboardHandler.bind(this));
  }

  private keyboardHandler(key: { name: string }) {
    console.log('KEY PRESSED');
    switch (key.name) {
      case 'q':
        new ConfirmPopup({
          id: 'quitApplication',
          title: 'Are you sure want to quit?',
        })
          .show()
          .on('confirm', () => {
            process.exit(0);
          });
        break;
      case 'space':
        this.eventEmitter.emit(WorkerEvent.ToggleTaskRunner);
        break;
    }
  }
}