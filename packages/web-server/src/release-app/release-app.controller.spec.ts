import { Test, TestingModule } from '@nestjs/testing';
import { ReleaseAppController } from './release-app.controller';

describe('ReleaseAppController', () => {
  let controller: ReleaseAppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReleaseAppController],
    }).compile();

    controller = module.get<ReleaseAppController>(ReleaseAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
