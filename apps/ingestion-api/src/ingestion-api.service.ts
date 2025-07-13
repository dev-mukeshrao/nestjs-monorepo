import { TriggerIngestionDto } from '@app/common-library/dtos/ingestions/trigger-ingestion.dto';
import { IngestionJob, IngestionStatus } from '@app/common-library/entities/ingestion.entity';
import { Injectable, InternalServerErrorException, NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as pdfParse from 'pdf-parse';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class IngestionApiService {
  constructor(
    @InjectRepository(IngestionJob) private ingestionRepo: Repository<IngestionJob>,
    private readonly httpService: HttpService
){}


  async triggerIngestion(documentId: number, filename: string, req :Request){ 
    
    let doc = await this.getDocumentDetails(documentId, req)
  
    if (!doc) throw new NotFoundException(`Document with ID ${documentId} not found`);

    const filePath = path.resolve(process.cwd(), 'uploads', doc.filename);
    
    try {
      await fs.access(filePath);
    } catch {
      throw new NotFoundException('Document file not found!');
    }

    if (!filename.endsWith('.pdf')) {
      const failedJob = this.ingestionRepo.create({
        documentId,
        status: IngestionStatus.FAILED,
        errorMessage: 'Unsupported file type',
      });
      await this.ingestionRepo.save(failedJob);
      throw new UnsupportedMediaTypeException('Only PDF files are supported for ingestion.');
    }

    try {
      const buffer = await fs.readFile(filePath);
      const data = await pdfParse(buffer);

      const ingestion = this.ingestionRepo.create({
        documentId,
        wordCount: data.text.split(/\s+/).length,
        pageCount: data.numpages,
        textPreview: data.text.slice(0, 500),
      });

      ingestion.status = IngestionStatus.COMPLETED;
      return await this.ingestionRepo.save(ingestion);
    } catch (err) {
      throw new InternalServerErrorException(`Ingestion failed: ${err.message}`);
    }
  }
  async findAllJobs(){
    return this.ingestionRepo.find({ order: {createdAt: 'DESC'}})
  }

  async findOneJob(id: number){
    return this.ingestionRepo.findOneBy({id})
  }

  async retryJob(id: number){
    const job = await this.findOneJob(id);
    if(!job) throw new NotFoundException('No Job found');

    job.status = IngestionStatus.PENDING;
    job.errorMessage = '';

    return this.ingestionRepo.save(job)

  }

  async getDocumentDetails(documentId:number, req: Request){
    try {
      const token = req.headers['authorization'];
    const res = await firstValueFrom(
      this.httpService.get(`http://localhost:3002/document/${documentId}`, {
        headers: {
          Authorization: token, 
        },
      })
    );

    return res.data
  } catch (err) {
    throw new NotFoundException(`Document with ID ${documentId} not found`);
  }
  }
}
