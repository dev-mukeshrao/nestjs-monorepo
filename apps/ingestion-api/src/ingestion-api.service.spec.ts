import { Test, TestingModule } from '@nestjs/testing';
import { IngestionApiService } from './ingestion-api.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IngestionJob, IngestionStatus } from '@app/common-library/entities/ingestion.entity';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { Request } from 'express';
import * as fs from 'fs/promises';
import * as pdfParse from 'pdf-parse';

jest.mock('fs/promises');
jest.mock('pdf-parse', () => jest.fn());

describe('IngestionApiService', () => {
  let service: IngestionApiService;
  let mockRepo: any;
  let mockHttpService: any;

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockHttpService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionApiService,
        {
          provide: getRepositoryToken(IngestionJob),
          useValue: mockRepo,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<IngestionApiService>(IngestionApiService);
  });

  describe('triggerIngestion', () => {
    it('should ingest a valid PDF document', async () => {
      const documentId = 1;
      const filename = 'sample.pdf';
      const req = {
        headers: { authorization: 'Bearer test-token' },
      } as unknown as Request;

      // Mock document API response
      const document = { id: documentId, filename };
      mockHttpService.get.mockReturnValue(of({ data: document }));

      // Mock fs.access and fs.readFile
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('PDF content'));

      // Mock pdfParse
      (pdfParse as jest.Mock).mockResolvedValue({
        text: 'This is a sample PDF document',
        numpages: 2,
      });

      // Mock repo
      const savedJob = { id: 100, status: IngestionStatus.COMPLETED };
      mockRepo.create.mockReturnValue(savedJob);
      mockRepo.save.mockResolvedValue(savedJob);

      const result = await service.triggerIngestion(documentId, filename, req);
      expect(result).toEqual(savedJob);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should throw if document not found in external service', async () => {
      const req = { headers: { authorization: 'Bearer xyz' } } as Request;
      mockHttpService.get.mockImplementation(() => {
        throw new Error('Not found');
      });

      await expect(
        service.triggerIngestion(99, 'file.pdf', req),
      ).rejects.toThrow('Document with ID 99 not found');
    });

    it('should throw if file does not exist on disk', async () => {
      const req = { headers: { authorization: 'Bearer abc' } } as Request;
      mockHttpService.get.mockReturnValue(of({ data: { id: 1, filename: 'file.pdf' } }));
      (fs.access as jest.Mock).mockRejectedValue(new Error('No file'));

      await expect(service.triggerIngestion(1, 'file.pdf', req)).rejects.toThrow('Document file not found!');
    });

    it('should throw for non-pdf file types', async () => {
      const req = { headers: { authorization: 'Bearer abc' } } as Request;
      const doc = { id: 1, filename: 'image.jpg' };
      mockHttpService.get.mockReturnValue(of({ data: doc }));
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      mockRepo.create.mockReturnValue({});
      mockRepo.save.mockResolvedValue({});

      await expect(service.triggerIngestion(1, 'image.jpg', req)).rejects.toThrow(
        'Only PDF files are supported for ingestion.',
      );
    });

    it('should throw on pdf parse or processing error', async () => {
      const req = { headers: { authorization: 'Bearer abc' } } as Request;
      const doc = { id: 1, filename: 'file.pdf' };
      mockHttpService.get.mockReturnValue(of({ data: doc }));
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('data'));
      (pdfParse as jest.Mock).mockRejectedValue(new Error('Failed to parse'));

      await expect(service.triggerIngestion(1, 'file.pdf', req)).rejects.toThrow(
        'Ingestion failed: Failed to parse',
      );
    });
  });
});
