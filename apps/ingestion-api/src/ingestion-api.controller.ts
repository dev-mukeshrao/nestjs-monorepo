import { Controller, Get } from '@nestjs/common';
import { IngestionApiService } from './ingestion-api.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('ingestions')
@Controller()
export class IngestionApiController {
  constructor(private readonly ingestionApiService: IngestionApiService) {}

  @Get()
  @ApiOperation({summary: 'Get all ingestion'})
  getHello(): string {
    return this.ingestionApiService.getHello();
  }
}
