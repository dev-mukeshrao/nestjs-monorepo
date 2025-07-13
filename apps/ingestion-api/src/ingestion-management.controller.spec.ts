import { Test, TestingModule } from '@nestjs/testing';
import { IngestionManagementController } from './ingestion-management.controller';
import { IngestionApiService } from './ingestion-api.service';

describe('IngestionManagementController', () => {
  let controller: IngestionManagementController;
  let service: IngestionApiService;

  const mockService = {
    findAllJobs: jest.fn(),
    findOneJob: jest.fn(),
    retryJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionManagementController],
      providers: [
        {
          provide: IngestionApiService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<IngestionManagementController>(IngestionManagementController);
    service = module.get<IngestionApiService>(IngestionApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllJobs', () => {
    it('should return all jobs', async () => {
      const mockJobs = [{ id: 1 }, { id: 2 }];
      mockService.findAllJobs.mockResolvedValue(mockJobs);

      const result = await controller.findAllJobs();

      expect(result).toEqual(mockJobs);
      expect(service.findAllJobs).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByJobId', () => {
    it('should return job by id', async () => {
      const jobId = 1;
      const mockJob = { id: jobId, status: 'COMPLETED' };
      mockService.findOneJob.mockResolvedValue(mockJob);

      const result = await controller.findByJobId(jobId);

      expect(result).toEqual(mockJob);
      expect(service.findOneJob).toHaveBeenCalledWith(jobId);
    });
  });

  describe('retry', () => {
    it('should retry job by id', async () => {
      const jobId = 1;
      const mockRetriedJob = { id: jobId, status: 'PENDING' };
      mockService.retryJob.mockResolvedValue(mockRetriedJob);

      const result = await controller.retry(jobId);

      expect(result).toEqual(mockRetriedJob);
      expect(service.retryJob).toHaveBeenCalledWith(jobId);
    });
  });
});
