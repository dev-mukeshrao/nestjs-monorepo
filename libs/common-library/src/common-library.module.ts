import { Module } from '@nestjs/common';
import { CommonLibraryService } from './common-library.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'apps/user-api/src/entities/user.entity';

@Module({
  imports:[
    TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db.sqlite',
          entities: [User],
          synchronize: true
        }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '1d'}
    })
  ],
  providers: [CommonLibraryService, JwtStrategy],
  exports: [CommonLibraryService, JwtModule, PassportModule, JwtStrategy],
})
export class CommonLibraryModule {}
