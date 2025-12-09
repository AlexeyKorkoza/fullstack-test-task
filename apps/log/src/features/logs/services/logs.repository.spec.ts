import { Test, TestingModule } from '@nestjs/testing';
import { LogsRepository } from './logs.repository';

describe('LogsRepository', () => {
  let service: LogsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsRepository],
    }).compile();

    service = module.get<LogsRepository>(LogsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
