import { Module } from '@nestjs/common';
import { DbClient } from '../dataAccess/db';
import { ReposService } from '../services/repos';
import { ReposController } from '../controllers/repos.controller';

@Module({
  providers: [
    ReposService,
    DbClient,
  ],
  controllers: [ReposController]
})
export class ReposModule {}