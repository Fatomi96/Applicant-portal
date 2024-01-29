import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ApplicantService } from '../applicant.service';
import {
  createApplicantDto,
  signinApplicantDto,
} from '../../../DTOs/applicants-DTO/applicant.dto';
import { Applicant } from '../applicant.entity';
import { EncryptionService } from '../../../helpers/encryption/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Applicant)
    private applicantRepo: Repository<Applicant>,
    private applicantService: ApplicantService,
    private jwtService: JwtService,
    private encryptionservice: EncryptionService,
    //private mailerService: MailerService,
  ) {}

  async signup(data: createApplicantDto) {
    try {
      const { firstName, lastName, email, password, phoneNumber } = data;

      const checkApplicant = await this.applicantRepo.findOneBy({
        email,
      });

      if (checkApplicant) {
        throw new ConflictException(
          'Warning====> this applicant exists already',
        );
      }

      //const salt = await bcrypt.genSalt(10);
      //const passwordHash = await bcrypt.hash(password, salt);

      const passwordHash = await this.encryptionservice.encrypt(password);

      const newApplicant = await this.applicantService.create({
        firstName,
        lastName,
        email,
        password: passwordHash,
        phoneNumber,
      });
      // const result = await this.mailerService.sendMail({
      //   to: emailAddress,
      //   subject: 'Welcome',
      //   template: './../../templates/welcome.pug',
      //   context: {
      //     name: firstName,
      //   },
      // });
      // console.log(result);

      return {
        message: 'Congratulations, you have been registered successfully',
        statusCode: 201,
        data: newApplicant,
      };
    } catch (err) {
      if (err instanceof ConflictException) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            message: err.message,
            error: 'CONFLICT',
          },
          HttpStatus.CONFLICT,
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
      throw new ConflictException('Warning====> this applicant exists already');
    }
  }

  async signin(data: signinApplicantDto) {
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
        data: { ...user, token: await this.jwtService.signAsync(payload) },
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
