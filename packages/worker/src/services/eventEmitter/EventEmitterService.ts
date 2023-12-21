import EventEmitter from 'events';
import { WorkerEvent, WorkerEventToPayload } from './events';
import { singleton } from 'tsyringe';


/**
 * Event bus service for the sake of decoupling
 */
@singleton()
export class EventEmitterService implements IEventEmitterService {
  private readonly ee = new EventEmitter();

  /**
   * Fire event
   */
  public emit<T extends WorkerEvent>(
    event: T,
    payload: T extends keyof WorkerEventToPayload ? WorkerEventToPayload[T] : never
  ): void;
  public emit<T extends WorkerEvent>(
    event: T extends keyof WorkerEventToPayload ? never : T
  ): void;
  public emit(event: WorkerEvent, payload?: unknown): void {
    this.ee.emit(event, payload);
  }

  /**
   * Subscribe
   */
  public addListener<T extends WorkerEvent>(
    event: T,
    handler: (payload: T extends keyof WorkerEventToPayload ? WorkerEventToPayload[T] : never) => void
  ): void {
    this.ee.addListener(event, handler);
  }

  /**
   * Unsubscribe
   */
  public removeListener<T extends WorkerEvent>(
    event: T,
    handler: (payload: T extends keyof WorkerEventToPayload ? WorkerEventToPayload[T] : never) => void
  ): void {
    this.ee.removeListener(event, handler);
  }

  /**
   * Adds a one-time listener
   */
  public once<T extends WorkerEvent>(
    event: T,
    handler: (payload: T extends keyof WorkerEventToPayload ? WorkerEventToPayload[T] : never) => void
  ): void {
    this.ee.on(event, handler);
  }
}

type EventListenerHandleMethod = <T extends WorkerEvent>(
  event: T,
  handler: (
    payload: T extends keyof WorkerEventToPayload ? WorkerEventToPayload[T] : never
  ) => void
) => void;


export interface IEventEmitterService {
  emit<T extends WorkerEvent>(
    event: T,
    payload: T extends keyof WorkerEventToPayload ? WorkerEventToPayload[T] : never
  ): void;
  emit<T extends WorkerEvent>(
    event: T extends keyof WorkerEventToPayload ? never : T
  ): void;

  addListener: EventListenerHandleMethod;
  removeListener: EventListenerHandleMethod
  once: EventListenerHandleMethod;
}