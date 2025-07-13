import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '@app/common-library/entities/document.entity';

@Injectable()
export class DocumentApiService {
  constructor(@InjectRepository(Document) private documentRepo: Repository<Document>) { }

  async uploadMultipleDocument(files: Express.Multer.File[], user: any, description?: string) {

    const docs: Document[] = [];
    for (const file of files) {
      const doc = this.documentRepo.create({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        filePath: file.path,
        description,
        owner: user,
      });
      const saved = await this.documentRepo.save(doc);
      docs.push(saved);
    }
  }

  async findAll() {
    return this.documentRepo.find();
  }

  async findOne(id: number) {
    return this.documentRepo.findOneBy({ id })
  }

  remove(id: number) {
    return this.documentRepo.delete(id)
  }

  async findByDocumentId(id: number){
    return await this.documentRepo.findOneBy({id})
  }

}