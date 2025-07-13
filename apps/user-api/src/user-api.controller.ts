import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserApiService } from './user-api.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common-library/guards/jwt-auth.guard';
import { Roles } from '@app/common-library/decorators/roles.decorator';
import { RolesGuard } from '@app/common-library/guards/roles.guard';
import { UpdateUserDto } from '@app/common-library/dtos/users/update-user.dto';
import { Role } from '@app/common-library/enums/roles.enum';


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

  @Roles(Role.ADMIN)
  @Get('users')
  @ApiOperation({summary:'Get user list (Admin Only)'})
  getUsersList(){
    return this.userApiService.getUserList()
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @Patch(':id')
  @ApiOperation({summary: 'Update users role'})
  updateUserRole(@Param('id') id: number,@Body() userDetails: UpdateUserDto ){
    return this.userApiService.updateUserRole(id, userDetails)
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({summary: 'Delete User'})
  deleteUser(@Param('id') id: number){
    return this.userApiService.deleteUser(id)
  }
  
}
