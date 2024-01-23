import { Module } from '@nestjs/common';
import { PackagesController } from '../controllers/packages.controller';
import { PackagesProvider } from '../providers/packages';
import { DbClient } from '../dataAccess/db';

@Module({
  providers: [
    PackagesProvider,
    DbClient,
  ],
  controllers: [PackagesController]
})
export class PackagesModule {}