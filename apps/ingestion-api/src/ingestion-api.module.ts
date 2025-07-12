import { Module } from '@nestjs/common';
import { IngestionApiController } from './ingestion-api.controller';
import { IngestionApiService } from './ingestion-api.service';

@Module({
  imports: [],
  controllers: [IngestionApiController],
  providers: [IngestionApiService],
})
export class IngestionApiModule {}
