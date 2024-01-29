import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class adminSigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
