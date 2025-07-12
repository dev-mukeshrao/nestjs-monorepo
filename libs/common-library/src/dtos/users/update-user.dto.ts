import { IsOptional, IsEmail, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  role?: 'admin' | 'editor' | ' viewer';

  @IsOptional()
  name?: string;
}
