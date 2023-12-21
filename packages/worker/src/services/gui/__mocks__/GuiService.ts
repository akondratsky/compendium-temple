import { IGuiService } from '../GuiService';

export class GuiService implements IGuiService {
  public render = jest.fn();
}
