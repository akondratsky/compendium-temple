import type { IHttpService } from '../HttpService';

export class HttpService implements IHttpService {
  public get = jest.fn();
  public post = jest.fn();
  public put = jest.fn();
  public patch = jest.fn();
}
