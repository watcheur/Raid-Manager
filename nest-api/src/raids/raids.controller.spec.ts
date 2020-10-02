import { Test, TestingModule } from '@nestjs/testing';
import { RaidsController } from './raids.controller';

describe('RaidsController', () => {
  let controller: RaidsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RaidsController],
    }).compile();

    controller = module.get<RaidsController>(RaidsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
