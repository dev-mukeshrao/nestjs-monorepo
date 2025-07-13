import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Res, UploadedFiles, UseGuards } from '@nestjs/common';
import { DocumentApiService } from './document-api.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CustomDocumentInterceptor } from './interceptors/upload-document.interceptor';
import { CreateDocumentDto } from '@app/common-library/dtos/documents/create-document.dto';
import { User } from '@app/common-library/decorators/users.decorator';
import { JwtAuthGuard } from '@app/common-library/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common-library/guards/roles.guard';
import { Roles } from '@app/common-library/decorators/roles.decorator';
import { join } from 'path';
import { existsSync } from 'fs';
import { Response } from 'express';
import { Role } from '@app/common-library/enums/roles.enum';

@ApiTags('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('document')
export class DocumentApiController {
  constructor(private readonly documentApiService: DocumentApiService) { }

  @Post('upload')
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({summary: 'Upload multiple files'})
  @CustomDocumentInterceptor('files')
  async multiUpload(@UploadedFiles() files: Express.Multer.File[], @Body() fileDetails: CreateDocumentDto, @User() user: any) {
    return this.documentApiService.uploadMultipleDocument(files, user.userId, fileDetails.description)
  }

  @Get('download/:id')
  @ApiParam({ name: 'id', required: true, type: Number, description: 'Document ID' })
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  @ApiOperation({summary:'Download document by id'})
  async downloadDocument(@Param('id') id: number, @Res() res: Response) {
    const doc = await this.documentApiService.findOne(id);
    if (!doc) throw new NotFoundException('Document not found');

    const filePath = join(process.cwd(), 'uploads', doc.filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found on disk');
    }

    return res.download(filePath, doc.originalname);
  }

  @Get()
  @ApiOperation({summary: 'Get All documents'})
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  findAll() {
    return this.documentApiService.findAll();
  }

  @Roles(Role.ADMIN)
  @ApiOperation({summary: 'Get Document by id'})
  @ApiParam({ name: 'id', required: true, type: Number, description: 'Document ID' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.documentApiService.findOne(id)
  }

  @Delete(':id')
  @ApiOperation({summary: 'Delete document by id'})
  @ApiParam({ name: 'id', required: true, type: Number, description: 'Document Id' })
  @Roles(Role.ADMIN)
  delete(@Param('id') id: number) {
    return this.documentApiService.remove(id);
  }

  @Get(':id')
  getDocumentDetails(@Param('id') id: number){
    return this.documentApiService.findByDocumentId(id)
  }

}
