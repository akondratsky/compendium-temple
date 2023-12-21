import { ConsoleManager, PageBuilder } from 'console-gui-tools';


export abstract class AbstractPage extends PageBuilder {
  protected _mount(gui: ConsoleManager): void {
    // no implementation by default
  }

  protected _unmount(guid: ConsoleManager): void {
    // no implementation by default
  }

  public mount(gui: ConsoleManager) {
    this._mount(gui);
    gui.setPage(this);
    return this;
  }

  public unmount(gui: ConsoleManager) {
    this._unmount(gui);
  }
}