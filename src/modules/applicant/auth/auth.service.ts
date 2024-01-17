import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApplicantService } from '../applicant.service';
import {
  createApplicantDto,
  signinApplicantDto,
} from '../../../interfaces/applicant.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Applicant } from '../applicant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Applicant)
    private applicantRepo: Repository<Applicant>,
    private applicantService: ApplicantService,
    private jwtService: JwtService,
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

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

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
      console.log(err);
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
      const userPassword = await bcrypt.compare(password, user.password);

      if (!userPassword) {
        throw new UnauthorizedException('Invalid Credentials');
      }
      const payload = { sub: user.id };

      return {
        message: 'Success',
        statusCode: 200,
        data: { ...user, token: await this.jwtService.signAsync(payload) },
      };
    } catch (err) {
      console.log(err);
    }
  }
}
