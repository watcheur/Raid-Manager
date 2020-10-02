import { Test, TestingModule } from '@nestjs/testing';
import { ExpansionsService } from './expansions.service';

describe('ExpansionsService', () => {
  let service: ExpansionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpansionsService],
    }).compile();

    service = module.get<ExpansionsService>(ExpansionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
