import { version } from '@compendium-temple/worker/package.json';
import { Injectable } from '@nestjs/common';

export interface IVersionProvider {
  get current(): string;
}

@Injectable()
export class VersionProvider implements IVersionProvider {
  get current(): string {
    return version;
  }
}
