import {
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class createApplicantDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit.',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class signinApplicantDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
