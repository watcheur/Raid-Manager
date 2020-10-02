import { Test, TestingModule } from '@nestjs/testing';
import { RaidsService } from './raids.service';

describe('RaidsService', () => {
  let service: RaidsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RaidsService],
    }).compile();

    service = module.get<RaidsService>(RaidsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
