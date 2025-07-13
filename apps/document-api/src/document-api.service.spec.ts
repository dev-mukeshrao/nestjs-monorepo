import { Test, TestingModule } from '@nestjs/testing';
import { DocumentApiService } from './document-api.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '@app/common-library/entities/document.entity';
import { Repository } from 'typeorm';
import { Readable } from 'stream';

const mockDocumentRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
});

const mockFile: Express.Multer.File = {
  originalname: 'test.pdf',
  mimetype: 'application/pdf',
  size: 2048,
  filename: 'abc123-test.pdf',
  path: '/uploads/abc123-test.pdf',
  fieldname: 'files',
  destination: '',
  encoding: '',
  buffer: Buffer.from(''),
  stream: Readable.from([]),
};

const mockUser = {
  id: 1,
  name: 'John Doe',
  role: 'admin',
};

describe('DocumentApiService', () => {
  let service: DocumentApiService;
  let repo: jest.Mocked<Repository<Document>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentApiService,
        {
          provide: getRepositoryToken(Document),
          useFactory: mockDocumentRepo,
        },
      ],
    }).compile();

    service = module.get<DocumentApiService>(DocumentApiService);
    repo = module.get(getRepositoryToken(Document));
  });

  describe('uploadMultipleDocument', () => {
    it('should create and save multiple documents', async () => {
      const file = mockFile;
      const createdDoc = { ...file, id: 1, description: 'desc', owner: mockUser };
      repo.create.mockReturnValue(createdDoc as any);
      repo.save.mockResolvedValue(createdDoc as any);

      const result = await service.uploadMultipleDocument([file], mockUser, 'desc');

      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(repo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      const docs = [{ id: 1 }, { id: 2 }];
      repo.find.mockResolvedValue(docs as any);

      const result = await service.findAll();
      expect(result).toEqual(docs);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one document by id', async () => {
      const doc = { id: 1 };
      repo.findOneBy.mockResolvedValue(doc as any);

      const result = await service.findOne(1);
      expect(result).toEqual(doc);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('remove', () => {
    it('should delete the document by id', async () => {
      const deleteResult = { affected: 1 };
      repo.delete.mockResolvedValue(deleteResult as any);

      const result = await service.remove(1);
      expect(result).toEqual(deleteResult);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findByDocumentId', () => {
    it('should return document details by document id', async () => {
      const doc = { id: 1 };
      repo.findOneBy.mockResolvedValue(doc as any);

      const result = await service.findByDocumentId(1);
      expect(result).toEqual(doc);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
