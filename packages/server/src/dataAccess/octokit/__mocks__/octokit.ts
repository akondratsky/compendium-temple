import { IOctokitClient } from '../octokitClient';

export class OctokitClient implements IOctokitClient {
  public getAuthenticatedUser = jest.fn();
}