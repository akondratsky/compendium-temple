import { singleton } from 'tsyringe';
import { emitKeypressEvents } from 'node:readline';

export interface IUiService {
  pressAnyKey(): Promise<void>;
}

@singleton()
export class UiService implements IUiService {
  public async pressAnyKey() {
    return new Promise<void>((resolve) => {
      emitKeypressEvents(process.stdin);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
      }
      process.stdin.on('keypress', () => {
        process.stdin.setRawMode(false);
        resolve();
      });
    });
  }
}