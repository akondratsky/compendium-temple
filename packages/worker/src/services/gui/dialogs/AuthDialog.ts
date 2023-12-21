import { CustomPopup } from 'console-gui-tools';
import { inject, singleton } from 'tsyringe';
import { AuthDialogPage } from '../pages';
import { EventEmitterService, IEventEmitterService, WorkerEvent } from '../../eventEmitter';

@singleton()
export class AuthDialog {
  constructor(
    @inject(EventEmitterService) private readonly eventEmitter: IEventEmitterService,
  ) {
    this.eventEmitter.addListener(WorkerEvent.OpenAuthDialog, this.open.bind(this));
    this.eventEmitter.addListener(WorkerEvent.CloseAuthDialog, this.close.bind(this));
  }
  
  private popup: CustomPopup | null = null;


  private open({ url, code }: { url: string, code: string }) {
    const pb = new AuthDialogPage(url, code);
    this.popup = new CustomPopup({
      id: 'authPopup',
      title: 'Authorization required',
      content: pb,
      width: 65,
    });
    this.popup.show();
  }


  private close() {
    console.log('closing auth dialog...');
    this.popup?.hide();
  }
}