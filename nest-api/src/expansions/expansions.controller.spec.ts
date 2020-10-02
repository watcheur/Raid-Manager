import { Test, TestingModule } from '@nestjs/testing';
import { ExpansionsController } from './expansions.controller';

describe('ExpansionsController', () => {
  let controller: ExpansionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpansionsController],
    }).compile();

    controller = module.get<ExpansionsController>(ExpansionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
