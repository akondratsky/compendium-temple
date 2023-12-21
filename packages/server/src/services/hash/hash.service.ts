import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';

export interface IHashService {
  calc(value: string): Promise<string>;
}

@Injectable()
export class HashService implements IHashService {
  public async calc(value: string) {
    return hash(value + process.env.AUTH_TOKEN_HASH_SALT, 10);
  }
}
