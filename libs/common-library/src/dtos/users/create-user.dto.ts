import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  VIEWER = 'viewer',
  EDITOR = 'editor',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole,{message: `Role must be one of: ${Object.values(UserRole).join(', ')}`})
  role: UserRole;
}
