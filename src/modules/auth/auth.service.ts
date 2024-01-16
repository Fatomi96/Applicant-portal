import { ConflictException, Injectable } from '@nestjs/common';
import { ApplicantService } from '../applicant/applicant.service';
import { createApplicantDto } from '../../interfaces/applicant.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Applicant } from '../applicant/applicant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Applicant)
    private applicantRepo: Repository<Applicant>,
    private applicantService: ApplicantService,
    //private mailerService: MailerService,
  ) {}

  async signup(data: createApplicantDto) {
    try {
      const { firstName, lastName, emailAddress, password, phoneNumber } = data;

      const checkApplicant = await this.applicantRepo.findOneBy({
        emailAddress,
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
        emailAddress,
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
    }
  }
}
