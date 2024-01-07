import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { VersionProvider } from '../../providers/version';

@Injectable()
export class VersionMiddleware implements NestMiddleware {
  constructor(
    private readonly version: VersionProvider,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader('X-Compendium-Worker-Version', this.version.current);
    next();
  }
}
