import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;
}