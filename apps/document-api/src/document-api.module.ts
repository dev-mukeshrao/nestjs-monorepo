import { Module } from '@nestjs/common';
import { DocumentApiController } from './document-api.controller';
import { DocumentApiService } from './document-api.service';

@Module({
  imports: [],
  controllers: [DocumentApiController],
  providers: [DocumentApiService],
})
export class DocumentApiModule {}
