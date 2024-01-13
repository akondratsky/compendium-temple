import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { TaskManagerService } from '../services/taskManager';
import { PayloadService } from '../services/payload';
import { MissionProvider } from '../providers/mission';
import { TaskProvider } from '../providers/task';
import { ListReposPayloadProvider } from '../providers/listReposPayload';
import { GetDepsPayloadProvider } from '../providers/getDepsPayload';
import { DetailRepoPayloadProvider } from '../providers/detailRepoPayload';
import { BoardProvider } from '../providers/board';
import { DbClient } from '../dataAccess/db';

@Module({
  imports: [
    AuthModule
  ],
  providers: [
    TaskManagerService,
    TaskProvider,
    MissionProvider,
    DbClient,
    PayloadService,
    ListReposPayloadProvider,
    GetDepsPayloadProvider,
    DetailRepoPayloadProvider,
    BoardProvider
  ],
  exports: [
    TaskManagerService,
  ],
})
export class TaskManagerModule { }
