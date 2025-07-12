import { Exclude } from "class-transformer";

export class UserResponseDto {
  id: number;
  email: string;

  @Exclude()
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
