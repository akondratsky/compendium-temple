import { IHashService } from '../hash.service';

export class HashService implements IHashService {
  public calc = jest.fn();
}