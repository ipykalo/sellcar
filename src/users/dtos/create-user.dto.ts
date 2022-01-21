import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}