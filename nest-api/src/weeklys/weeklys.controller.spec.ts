import { Test, TestingModule } from '@nestjs/testing';
import { WeeklysController } from './weeklys.controller';

describe('WeeklysController', () => {
  let controller: WeeklysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeeklysController],
    }).compile();

    controller = module.get<WeeklysController>(WeeklysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
