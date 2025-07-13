import { Body, Controller, Get, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { IngestionApiService } from './ingestion-api.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TriggerIngestionDto } from '@app/common-library/dtos/ingestions/trigger-ingestion.dto';
import { JwtAuthGuard } from '@app/common-library/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common-library/guards/roles.guard';
import { Roles } from '@app/common-library/decorators/roles.decorator';
import { Role } from '@app/common-library/enums/roles.enum';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('ingestionjob')
@Controller('ingestionjob')
export class IngestionApiController {
  constructor(private readonly ingestionApiService: IngestionApiService,
    
  ) {}

  @Get('trigger')
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Trigger ingestion for a file and document ID' })
  @ApiQuery({ name: 'filename', required: true, description: 'Name of the file to ingest' })
  @ApiQuery({ name: 'documentId', required: true, description: 'Associated document ID' })
  async trigger( @Query('filename') filename: string,
    @Query('documentId', ParseIntPipe) documentId: number,@Req() req:Request){
    return this.ingestionApiService.triggerIngestion(documentId, filename, req)
  }
}
