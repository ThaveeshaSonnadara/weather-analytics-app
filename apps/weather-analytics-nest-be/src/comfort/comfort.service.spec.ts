import { Test, TestingModule } from '@nestjs/testing';
import { ComfortService } from './comfort.service';

describe('ComfortService', () => {
  let service: ComfortService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComfortService],
    }).compile();

    service = module.get<ComfortService>(ComfortService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
