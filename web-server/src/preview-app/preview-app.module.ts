import { Module } from '@nestjs/common';
import { PreviewAppController } from './preview-app.controller';
import { PreviewAppService } from './preview-app.service';

@Module({
  controllers: [PreviewAppController],
  providers: [PreviewAppService]
})
export class PreviewAppModule {}
