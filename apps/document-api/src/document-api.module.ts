import { Module } from '@nestjs/common';
import { DocumentApiController } from './document-api.controller';
import { DocumentApiService } from './document-api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '@app/common-library/entities/document.entity';
import { CommonLibraryModule } from '@app/common-library';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    CommonLibraryModule
],
  controllers: [DocumentApiController],
  providers: [DocumentApiService]
})
export class DocumentApiModule {}
