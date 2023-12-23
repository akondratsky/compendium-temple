import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';

export interface IHashUtil {
  calc(value: string): Promise<string>;
}

@Injectable()
export class HashUtil implements IHashUtil {
  public async calc(value: string) {
    return hash(value + process.env.AUTH_TOKEN_HASH_SALT, 10);
  }
}
