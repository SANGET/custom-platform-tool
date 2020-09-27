import { Test, TestingModule } from '@nestjs/testing';
import { PreviewAppService } from './preview-app.service';

describe('PreviewAppService', () => {
  let service: PreviewAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreviewAppService],
    }).compile();

    service = module.get<PreviewAppService>(PreviewAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
