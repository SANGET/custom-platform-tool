import { Test, TestingModule } from '@nestjs/testing';
import { PageDataController } from './page-data.controller';

describe('PageDataController', () => {
  let controller: PageDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageDataController],
    }).compile();

    controller = module.get<PageDataController>(PageDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
