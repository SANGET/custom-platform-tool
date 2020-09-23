import { Test, TestingModule } from '@nestjs/testing';
import { PageDataService } from './page-data.service';

describe('PageDataService', () => {
  let service: PageDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageDataService],
    }).compile();

    service = module.get<PageDataService>(PageDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
