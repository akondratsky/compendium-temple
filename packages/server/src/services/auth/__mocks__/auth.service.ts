import { IAuthService } from '../auth.service';

export class AuthService implements IAuthService {
  public authenticate = jest.fn();
  public getCurrentUser = jest.fn();
  public getCurrentUserId = jest.fn();
}