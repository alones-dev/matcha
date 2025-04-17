import { IsEmail, IsString, MinLength, MaxLength, IsDateString, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  firstName: string; 

  @IsString()
  @IsNotEmpty()
  lastName: string; 

  @IsString()
  gender: string; 

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  confirmPassword: string;

  @IsDateString() 
  @IsNotEmpty()
  birthDate: string;
}