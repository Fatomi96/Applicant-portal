import { IsDateString, IsDecimal, IsNotEmpty, IsString } from 'class-validator';

export class UpdateApplicantDto {
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  university: string;

  @IsString()
  @IsNotEmpty()
  courseOfStudy: string;

  @IsDecimal()
  @IsNotEmpty()
  cgpa: number;
}
