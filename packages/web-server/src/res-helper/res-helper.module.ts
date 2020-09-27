import { Global, Module } from '@nestjs/common';
import { ResHelperService } from './res-helper.service';

@Global()
@Module({
  providers: [ResHelperService],
  exports: [ResHelperService],
})
export class ResHelperModule {}
