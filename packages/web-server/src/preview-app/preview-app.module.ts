import { Global, Module } from '@nestjs/common';
import { PreviewAppController } from './preview-app.controller';
import { PreviewAppService } from './preview-app.service';

@Global()
@Module({
  controllers: [PreviewAppController],
  providers: [PreviewAppService],
  exports: [PreviewAppService],
})
export class PreviewAppModule {}
