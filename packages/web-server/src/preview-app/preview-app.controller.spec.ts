import { Test, TestingModule } from '@nestjs/testing';
import { PreviewAppController } from './preview-app.controller';

describe('PreviewAppController', () => {
  let controller: PreviewAppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreviewAppController],
    }).compile();

    controller = module.get<PreviewAppController>(PreviewAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
