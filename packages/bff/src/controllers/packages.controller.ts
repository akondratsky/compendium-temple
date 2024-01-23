import { Query, Controller, Get, Logger } from '@nestjs/common';
import { PackagesProvider } from '../providers/packages';

@Controller('packages')
export class PackagesController {
  constructor(
    private readonly packagesProvider: PackagesProvider,
  ) { }

  private readonly logger = new Logger(PackagesController.name);

  @Get()
  async search(@Query('search') searchString: string) {
    this.logger.debug(`GET /packages?search=${searchString}`);
    return this.packagesProvider.search(searchString);
  }
}
