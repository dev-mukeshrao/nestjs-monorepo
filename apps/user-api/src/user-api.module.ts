import { Module } from '@nestjs/common';
import { UserApiController } from './user-api.controller';
import { UserApiService } from './user-api.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../../../libs/common-library/src/jwt.strategy';
import { AuthController } from './auth.controller';
import { CommonLibraryModule } from '@app/common-library';
import { User } from '@app/common-library/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CommonLibraryModule],
  controllers: [UserApiController, AuthController],
  providers: [UserApiService],
})
export class UserApiModule {}
