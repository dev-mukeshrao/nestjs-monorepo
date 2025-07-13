import { Test, TestingModule } from '@nestjs/testing';
import { IngestionApiController } from './ingestion-api.controller';
import { IngestionApiService } from './ingestion-api.service';
import { Request } from 'express';

describe('IngestionApiController', () => {
  let controller: IngestionApiController;
  let service: IngestionApiService;

  const mockIngestionService = {
    triggerIngestion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionApiController],
      providers: [
        {
          provide: IngestionApiService,
          useValue: mockIngestionService,
        },
      ],
    }).compile();

    controller = module.get<IngestionApiController>(IngestionApiController);
    service = module.get<IngestionApiService>(IngestionApiService);
  });

  it('should call ingestionService.triggerIngestion with correct parameters', async () => {
    const filename = 'test.pdf';
    const documentId = 1;

    const mockRequest = {
      headers: {
        authorization: 'Bearer mocktoken',
      },
    } as unknown as Request;

    const mockResult = { success: true };
    mockIngestionService.triggerIngestion.mockResolvedValue(mockResult);

    const result = await controller.trigger(filename, documentId, mockRequest);

    expect(service.triggerIngestion).toHaveBeenCalledWith(documentId, filename, mockRequest);
    expect(result).toEqual(mockResult);
  });
});
