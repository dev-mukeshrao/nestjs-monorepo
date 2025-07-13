import { Controller, Get, Injectable, Param, Post, UseGuards } from "@nestjs/common";
import { IngestionApiService } from "./ingestion-api.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@app/common-library/guards/jwt-auth.guard";
import { RolesGuard } from "@app/common-library/guards/roles.guard";
import { Roles } from "@app/common-library/decorators/roles.decorator";
import { Role } from "@app/common-library/enums/roles.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Ingestion-Management')
@Controller('ingestion')
export class IngestionManagementController{
    constructor(private ingestionService:IngestionApiService){}

    @Get()
    @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
    @ApiOperation({summary: 'Get all jobs'})
    findAllJobs(){
        return this.ingestionService.findAllJobs()
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
    @ApiOperation({summary: 'Get Job by id'})
    findByJobId(@Param('id') id: number){
        return this.ingestionService.findOneJob(id)
    }

    @Post('retry/:id')
    @Roles(Role.ADMIN, Role.EDITOR)
    @ApiOperation({summary: 'Retry failed job'})
    retry(@Param('id') id: number){
        return this.ingestionService.retryJob(id)
    }
}