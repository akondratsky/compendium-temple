import { Module } from '@nestjs/common';
import { PackagesModule } from './modules/packages.module';

@Module({
  imports: [
    PackagesModule,
  ],
})
export class AppModule {}
