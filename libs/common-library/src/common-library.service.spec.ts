import { Test, TestingModule } from '@nestjs/testing';
import { CommonLibraryService } from './common-library.service';

describe('CommonLibraryService', () => {
  let service: CommonLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonLibraryService],
    }).compile();

    service = module.get<CommonLibraryService>(CommonLibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
