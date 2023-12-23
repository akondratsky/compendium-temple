import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { ResultsController } from '../controllers/results.controller';
import { ResultsService } from '../services/results';
import { ListReposResultService } from '../services/listReposResult';
import { TaskManagerModule } from './taskManager.module';
import { DbClient } from '../dataAccess/db';
import { MapperUtil } from '../utils/mapper';

@Module({
  imports: [
    AuthModule,
    TaskManagerModule,
  ],
  controllers: [
    ResultsController,
  ],
  providers: [
    ResultsService,
    ListReposResultService,
    DbClient,
    MapperUtil,
  ],
})
export class ResultsModule {}
