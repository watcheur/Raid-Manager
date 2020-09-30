import { Test, TestingModule } from '@nestjs/testing';
import { RealmsService } from './realms.service';

describe('RealmsService', () => {
  let service: RealmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RealmsService],
    }).compile();

    service = module.get<RealmsService>(RealmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
