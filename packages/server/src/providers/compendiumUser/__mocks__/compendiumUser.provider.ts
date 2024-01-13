import type { ICompendiumUserProvider } from '../compendiumUser.provider';

export class CompendiumUserProvider implements ICompendiumUserProvider {
  public getByHash = jest.fn();
  public upsert = jest.fn();
}