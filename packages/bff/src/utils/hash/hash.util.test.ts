import { Test } from '@nestjs/testing';
import { HashUtil } from './hash.util';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
}));

describe('HashUtil', () => {
  let hashService: HashUtil;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [HashUtil],
    }).compile();
    hashService = moduleRef.get(HashUtil);
  });

  it('should be defined', () => {
    expect(HashUtil).toBeDefined();
  });

  it('should hash a string', async () => {
    const hash = await hashService.calc('test');
    expect(hash).toBe('hashed');
  });
});