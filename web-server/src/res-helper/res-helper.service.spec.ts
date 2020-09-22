import { Test, TestingModule } from '@nestjs/testing';
import { ResHelperService } from './res-helper.service';

describe('ResHelperService', () => {
  let service: ResHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResHelperService],
    }).compile();

    service = module.get<ResHelperService>(ResHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
