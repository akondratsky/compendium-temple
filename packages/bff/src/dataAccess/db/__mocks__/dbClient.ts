import { mockDeep } from 'jest-mock-extended';

export class DbClient {
  constructor() {
    return mockDeep<DbClient>();
  }
}
