import { Test } from '@nestjs/testing';
import { HashService } from './hash.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
}));

describe('HashService', () => {
  let hashService: HashService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [HashService],
    }).compile();
    hashService = moduleRef.get(HashService);
  });

  it('should be defined', () => {
    expect(HashService).toBeDefined();
  });

  it('should hash a string', async () => {
    const hash = await hashService.calc('test');
    expect(hash).toBe('hashed');
  });
});