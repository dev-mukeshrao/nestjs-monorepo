import { Body, ClassSerializerInterceptor, Controller, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserApiService } from './user-api.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from '@app/common-library/dtos/users/create-user.dto';
import { LoginDto } from '@app/common-library/dtos/users/login.dto';
import { JwtAuthGuard } from '@app/common-library/guards/jwt-auth.guard';
import { Roles } from '@app/common-library/decorators/roles.decorator';
import { RolesGuard } from '@app/common-library/guards/roles.guard';
import { UpdateUserDto } from '@app/common-library/dtos/users/update-user.dto';


@UseInterceptors(ClassSerializerInterceptor)
 @UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('users')
@Controller('user')
export class UserApiController {
  constructor(private readonly userApiService: UserApiService) {}
 
  @Get('profile')
  @ApiOperation({summary: 'User Profile'})
  getProfile(@Req() req){
      return req.user
  }

  @Roles('admin')
  @Get('users')
  @ApiOperation({summary:'Get user list (Admin Only)'})
  getUsersList(){
    return this.userApiService.getUserList()
  }

  @Roles('editor', 'admin')
  @Patch(':id')
  @ApiOperation({summary: 'Update users role'})
  updateUserRole(@Param('id') id: number,@Body() userDetails: UpdateUserDto ){
    return this.userApiService.updateUserRole(id, userDetails)
  }
  
}
