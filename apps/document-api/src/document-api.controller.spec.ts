import { Test, TestingModule } from '@nestjs/testing';
import { DocumentApiController } from './document-api.controller';
import { DocumentApiService } from './document-api.service';

describe('DocumentApiController', () => {
  let documentApiController: DocumentApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DocumentApiController],
      providers: [DocumentApiService],
    }).compile();

    documentApiController = app.get<DocumentApiController>(DocumentApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(documentApiController.getHello()).toBe('Hello World!');
    });
  });
});
