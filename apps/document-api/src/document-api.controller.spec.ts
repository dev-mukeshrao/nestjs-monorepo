import { Test, TestingModule } from '@nestjs/testing';
import { DocumentApiController } from './document-api.controller';
import { DocumentApiService } from './document-api.service';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

describe('DocumentApiController', () => {
  let controller: DocumentApiController;
  let service: DocumentApiService;

  const mockService = {
    uploadMultipleDocument: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
    findByDocumentId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentApiController],
      providers: [
        { provide: DocumentApiService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<DocumentApiController>(DocumentApiController);
    service = module.get<DocumentApiService>(DocumentApiService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('multiUpload', () => {
    it('should upload multiple files', async () => {
      const files = [{ originalname: 'file1.pdf', filename: 'file1.pdf' }] as any;
      const user = { userId: 1 };
      const dto = { description: 'Test file' };
      const validCreateDocumentDto = {
  title: 'Annual Report 2025',
  description: 'Financial overview of the fiscal year 2025',
};

      mockService.uploadMultipleDocument.mockResolvedValue(['file1.pdf']);

      const result = await controller.multiUpload(files, validCreateDocumentDto, user);

      expect(service.uploadMultipleDocument).toHaveBeenCalledWith(files, user.userId, dto.description);
      expect(result).toEqual(['file1.pdf']);
    });
  });

  describe('downloadDocument', () => {
    it('should download file if document and file exist', async () => {
      const mockDoc = { filename: 'doc.pdf', originalname: 'original.pdf' };
      const res = {
        download: jest.fn(),
      } as any as Response;

      mockService.findOne.mockResolvedValue(mockDoc);
      (existsSync as jest.Mock).mockReturnValue(true);

      await controller.downloadDocument(1, res);

      const expectedPath = join(process.cwd(), 'uploads', mockDoc.filename);
      expect(res.download).toHaveBeenCalledWith(expectedPath, mockDoc.originalname);
    });

    it('should throw NotFoundException if document not found', async () => {
      mockService.findOne.mockResolvedValue(null);

      await expect(controller.downloadDocument(1, {} as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if file not found on disk', async () => {
      const mockDoc = { filename: 'doc.pdf', originalname: 'original.pdf' };
      mockService.findOne.mockResolvedValue(mockDoc);
      (existsSync as jest.Mock).mockReturnValue(false);

      await expect(controller.downloadDocument(1, {} as any)).rejects.toThrow('File not found on disk');
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      const docs = [{ id: 1 }, { id: 2 }];
      mockService.findAll.mockResolvedValue(docs);
      const result = await controller.findAll();
      expect(result).toEqual(docs);
    });
  });

  describe('findOne', () => {
    it('should return a document by id', async () => {
      const doc = { id: 1 };
      mockService.findOne.mockResolvedValue(doc);
      const result = await controller.findOne(1);
      expect(result).toEqual(doc);
    });
  });

  describe('getDocumentDetails', () => {
    it('should return document details by id', async () => {
      const docDetails = { id: 1, detail: 'Some detail' };
      mockService.findByDocumentId.mockResolvedValue(docDetails);
      const result = await controller.getDocumentDetails(1);
      expect(result).toEqual(docDetails);
    });
  });

  describe('delete', () => {
    it('should delete a document by id', async () => {
      mockService.remove.mockResolvedValue({ deleted: true });
      const result = await controller.delete(1);
      expect(result).toEqual({ deleted: true });
    });
  });
});
