import { Module } from '@nestjs/common';
import { ReleaseAppController } from './release-app.controller';

@Module({
  controllers: [ReleaseAppController]
})
export class ReleaseAppModule {}
