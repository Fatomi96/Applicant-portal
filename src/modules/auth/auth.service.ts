import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Logger from '../../utils/helpers/Logger';
import { Applicant } from '../applicant/applicant.entity';
import { EncryptionService } from '../../utils/helpers/encryptionService';
import { Admin } from '../admin/admin.entity';
import { RoleTypes } from './auth.interface';
import { CreateApplicantDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Applicant)
    private applicantRepo: Repository<Applicant>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private encryptionservice: EncryptionService,
  ) { }

  async createApplicant(data: CreateApplicantDto) {
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
      applicant.role = RoleTypes.APPLICANT;

      const createdApplicant = await this.applicantRepo.save(applicant);
      const { password, ...applicantData } = createdApplicant;

      Logger.info(`Applicant with email: ${createdApplicant.email} created successfully`);
      return { statusCode: HttpStatus.CREATED, message: `Applicant with email: ${createdApplicant.email} created successfully`, data: { ...applicantData } };
    } catch (error) {
      Logger.error(error || 'An error occurred during creation of applicant');
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
      const { email } = data;
      const user = await this.getUserType(email);

      if (!user) {
        Logger.warn('Account with this details not found');
        throw new NotFoundException('Account with this details not found');
      }

      const decryptPassword = await this.encryptionservice.decrypt(user.password);

      if (decryptPassword !== data.password) {
        Logger.warn('Unauthorized access - Invalid Credentials');
        throw new UnauthorizedException('Unauthorized access - Invalid Credentials');
      }

      const accessToken = await this.getTokens(email, user.role);
      const { password, ...userData } = user;

      Logger.info(`${user.role} with email ${user.email} logged-in successfully`);
      return { status: HttpStatus.OK, message: 'Login successful', ...accessToken, data: { ...userData } }
    } catch (error) {
      Logger.error(error);
      if (error instanceof UnauthorizedException) {
        throw new HttpException({
          status: HttpStatus.UNAUTHORIZED,
          message: error.message,
          error: 'UNAUTHORIZED ACCESS',
        }, HttpStatus.UNAUTHORIZED);
      } else if (error instanceof NotFoundException) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          message: error.message,
          error: 'NOT FOUND',
        }, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Login service failed, contact support team!',
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async getTokens(email: string, role: RoleTypes) {
    const expiresInHours = 5;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationTimestamp = currentTimestamp + expiresInHours * 60 * 60;

    const payload = JSON.stringify({ email, role, exp: expirationTimestamp });
    const accessToken = await this.encryptionservice.encrypt(payload);

    return { accessToken };
  }

  async getUserType(email: string) {
    let user: any;

    user = await this.applicantRepo.findOneBy({ email });

    if (!user) user = await this.adminRepository.findOneBy({ email });

    return user
  }
}