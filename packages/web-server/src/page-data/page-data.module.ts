import { Module } from '@nestjs/common';
import { PageDataController } from './page-data.controller';
import { PageDataService } from './page-data.service';

@Module({
  controllers: [PageDataController],
  providers: [PageDataService],
})
export class PageDataModule {}
