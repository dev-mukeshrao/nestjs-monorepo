import { Test, TestingModule } from '@nestjs/testing';
import { IngestionApiController } from './ingestion-api.controller';
import { IngestionApiService } from './ingestion-api.service';

describe('IngestionApiController', () => {
  let ingestionApiController: IngestionApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IngestionApiController],
      providers: [IngestionApiService],
    }).compile();

    ingestionApiController = app.get<IngestionApiController>(IngestionApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ingestionApiController.getHello()).toBe('Hello World!');
    });
  });
});
