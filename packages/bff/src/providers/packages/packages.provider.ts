import type { Package } from '@compendium-temple/api';
import { Injectable } from '@nestjs/common';
import { DbClient } from '../../dataAccess/db';

export interface IPackagesProvider {
  search(searchString: string): Promise<Package[]>;
}

@Injectable()
export class PackagesProvider implements IPackagesProvider {
  constructor(
    private readonly db: DbClient,
  ) {}

  async search(search: string): Promise<Package[]> {
    return await this.db.package.findMany({
      where: { name: { contains: search } },
      take: 10,
      select: { id: true, name: true },
    });
  }
}