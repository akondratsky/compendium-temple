import { IAuthService } from '../AuthService';

export class AuthService implements IAuthService {
  public getAccessToken = jest.fn();
  public authorize = jest.fn();
}
