import { Body, ClassSerializerInterceptor, Controller, Post, Req, UseInterceptors } from "@nestjs/common";
import { UserApiService } from "./user-api.service";
import { CreateUserDto } from "@app/common-library/dtos/users/create-user.dto";
import { LoginDto } from "@app/common-library/dtos/users/login.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserResponseDto } from "@app/common-library/dtos/users/user-response.dto";
import { plainToInstance } from "class-transformer";
import { Request } from "express";

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private userApiService: UserApiService) { }

    @Post('register')
    @ApiOperation({ summary: 'User Registration' })
    async register(@Body() userDetail: CreateUserDto) {
        return this.userApiService.create(userDetail)
       // return (UserResponseDto, user)
    }

    @Post('login')
    @ApiOperation({ summary: 'User Login' })
    async login(@Body() userDetails: LoginDto) {
        return this.userApiService.login(userDetails.email, userDetails.password)
    }

    @Post('logout')
    @ApiOperation({summary: 'Signout'})
    async logout(){
        return { message: 'Logout successfully! Please remove the token from client side'}
    }
}