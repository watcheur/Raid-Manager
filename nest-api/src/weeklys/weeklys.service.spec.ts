import { Test, TestingModule } from '@nestjs/testing';
import { WeeklysService } from './weeklys.service';

describe('WeeklysService', () => {
  let service: WeeklysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeeklysService],
    }).compile();

    service = module.get<WeeklysService>(WeeklysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
