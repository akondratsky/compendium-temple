import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { TasksController } from '../controllers/tasks.controller';
import { TaskManagerModule } from './taskManager.module';

@Module({
  imports: [
    AuthModule,
    TaskManagerModule,
  ],
  controllers: [
    TasksController,
  ],
})
export class TasksModule { }
