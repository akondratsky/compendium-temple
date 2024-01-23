import { Module } from '@nestjs/common';
import { PackagesModule } from './modules/packages.module';
import { ReposModule } from './modules/repos.module';

@Module({
  imports: [
    PackagesModule,
    ReposModule,
  ],
})
export class AppModule {}
