import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TasksModule } from './modules/tasks.module';
import { AuthModule } from './modules/auth.module';
import { ResultsModule } from './modules/results.module';
import { VersionMiddleware } from './middlewares/version';
import { VersionProvider } from './providers/version';

@Module({
  providers: [
    VersionProvider,
  ],
  imports: [
    TasksModule,
    AuthModule,
    ResultsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VersionMiddleware)
      .forRoutes('*');
  }
}
