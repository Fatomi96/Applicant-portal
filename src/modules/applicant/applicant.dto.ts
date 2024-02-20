import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Minimum value is 0' })
  @Max(5.0, { message: 'Maximum value is 5.0' })
  cgpa: number;
}
