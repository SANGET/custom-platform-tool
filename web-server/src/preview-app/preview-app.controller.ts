import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { PreviewAppService } from './preview-app.service';

@Controller('preview-app')
export class PreviewAppController {
  constructor(
    private readonly previewAppService: PreviewAppService
  ) {}
  
  @Post()
  previewApp(@Body() body, @Req() request: Request) {
    const { authorization: token } = request.headers;
    const { lessee, app } = body;
    // console.log(authorization);
    this.previewAppService.setToken(lessee, token);
    return 'aaa';
  }
}
