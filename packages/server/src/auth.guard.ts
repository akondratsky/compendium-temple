import { Injectable, CanActivate, Scope } from '@nestjs/common';
import { AuthService } from './services/auth';

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
  ) { }

  async canActivate(): Promise<boolean> {
    return await this.authService.authenticate();
  }
}