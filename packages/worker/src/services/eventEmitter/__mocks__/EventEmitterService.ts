import { IEventEmitterService } from '../EventEmitterService';

export class EventEmitterService implements IEventEmitterService {
  public addListener = jest.fn();
  public once = jest.fn();
  public removeListener = jest.fn();
  public emit = jest.fn();
}
