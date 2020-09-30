import { Test, TestingModule } from '@nestjs/testing';
import { RealmsController } from './realms.controller';

describe('RealmsController', () => {
  let controller: RealmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RealmsController],
    }).compile();

    controller = module.get<RealmsController>(RealmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
