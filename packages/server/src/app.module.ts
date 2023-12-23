import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks.module';
import { AuthModule } from './modules/auth.module';
import { ResultsModule } from './modules/results.module';

@Module({
  imports: [
    TasksModule,
    AuthModule,
    ResultsModule,
  ],
})
export class AppModule {}
