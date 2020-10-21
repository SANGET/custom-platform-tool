import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('release-app')
export class ReleaseAppController {
  @Get(':app')
  releaseApp(@Param() params) {
    const { app } = params;
    return app;
  }
}
