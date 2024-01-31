import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Logger from '../../utils/helpers/Logger';
import { ApplicantService } from '../applicant/applicant.service';
import { LoginDto, SignUpDto } from '../applicant/applicant.dto';
import { Applicant } from '../applicant/applicant.entity';
import { EncryptionService } from '../../utils/helpers/encryptionService';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Applicant)
    private applicantRepo: Repository<Applicant>,
    private applicantService: ApplicantService,
    private encryptionservice: EncryptionService,
  ) { }

  async createApplicant(data: SignUpDto) {
    try {
      const { firstName, lastName, email, phoneNumber } = data;
      const isApplicant = await this.applicantRepo.findOneBy({ email });

      if (isApplicant) {
        Logger.warn(`Conflict: An account exist with this email: ${email}, please login...`)
        throw new ConflictException(`Conflict: An account exist with this email: ${email}, please login...`);
      }

      const encryptedPassword = await this.encryptionservice.encrypt(data.password);
      const applicant = new Applicant();

      applicant.firstName = firstName;
      applicant.lastName = lastName;
      applicant.email = email;
      applicant.phoneNumber = phoneNumber;
      applicant.password = encryptedPassword;

      const createdApplicant = await this.applicantRepo.save(applicant);
      const { password, ...applicantData } = createdApplicant;

      Logger.info(`Applicant with email: ${createdApplicant.email} created successfully`);
      return { statusCode: HttpStatus.CREATED, message: `Applicant with email: ${createdApplicant.email} created successfully`, data: { ...applicantData } };
    } catch (error) {
      Logger.error(error.message || 'An error occurred during creation of applicant');
      if (error instanceof ConflictException) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            message: error.message,
            error: 'CONFLICT',
          },
          HttpStatus.CONFLICT);
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async login(data: LoginDto) {
    try {
      const { email, password } = data;
      const user = await this.applicantRepo.findOneBy({ email });

      if (!user) {
        throw new UnauthorizedException('Invalid Credentials');
      }
      const userPassword = await this.encryptionservice.decrypt(user.password);

      if (userPassword !== password) {
        throw new UnauthorizedException('Invalid Credentials');
      }
      const payload = { sub: user.id, email: user.email };

      return {
        message: 'Success',
        statusCode: 200,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        if (err instanceof UnauthorizedException) {
          throw new HttpException(
            {
              status: HttpStatus.UNAUTHORIZED,
              message: err.message,
              error: 'UNAUTHORIZED',
            },
            HttpStatus.UNAUTHORIZED,
          );
        } else {
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'Internal server error',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
      throw new UnauthorizedException('Invalid Credentials');
    }
  }
}