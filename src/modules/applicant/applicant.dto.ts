import {
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
  IsEmail,
  Length,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit.',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'Phone number must be an 11-digit number and must start with 0.' })
  @Matches(/^[0]\d{10}$/, { message: 'Phone number must be an 11-digit number and must start with 0.' })
  phoneNumber: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
