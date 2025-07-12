import { Controller, Get } from '@nestjs/common';
import { DocumentApiService } from './document-api.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('documents')
@Controller()
export class DocumentApiController {
  constructor(private readonly documentApiService: DocumentApiService) {}

  @Get()
  @ApiOperation({summary: 'Get all Documents'})
  getHello(): string {
    return this.documentApiService.getHello();
  }
}
