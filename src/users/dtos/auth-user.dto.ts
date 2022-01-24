import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}