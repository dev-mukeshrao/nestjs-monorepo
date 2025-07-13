import { Module } from '@nestjs/common';
import { IngestionApiController } from './ingestion-api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionJob } from '@app/common-library/entities/ingestion.entity';
import { CommonLibraryModule } from '@app/common-library';
import { IngestionManagementController } from './ingestion-management.controller';
import { HttpModule } from '@nestjs/axios';
import { IngestionApiService } from './ingestion-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([IngestionJob]),
CommonLibraryModule, HttpModule],
  controllers: [IngestionApiController,IngestionManagementController],
  providers: [IngestionApiService],
})
export class IngestionApiModule {}
