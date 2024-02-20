import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateApplicantDto } from './applicant.dto';
import Logger from '../../utils/helpers/Logger';
import { Applicant } from './applicant.entity';

@Injectable()
export class ApplicantService {
  constructor(
    @InjectRepository(Applicant)
    private applicantRepository: Repository<Applicant>,
  ) {}

  async updateApplicantProfile(
    email: string,
    updateApplicantDto: UpdateApplicantDto,
  ) {
    try {
      const { dateOfBirth, address, university, courseOfStudy, cgpa } =
        updateApplicantDto;
      const applicant = await this.applicantRepository.findOneBy({ email });

      if (!applicant) {
        Logger.warn('Account with this details not found');
        throw new NotFoundException('Account with this details not found');
      }

      applicant.dateOfBirth = dateOfBirth;
      applicant.address = address;
      applicant.university = university;
      applicant.courseOfStudy = courseOfStudy;
      applicant.cgpa = JSON.stringify(cgpa);
      applicant.hasCompletedProfile = true;

      const { password, ...applicantData } =
        await this.applicantRepository.save(applicant);

      Logger.info('Applicant profile updated successfully');
      return {
        status: HttpStatus.OK,
        message: 'Applicant profile updated successfully',
        data: { ...applicantData },
      };
    } catch (error) {
      Logger.error(error.message);
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            message: error.message,
            error: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            statuscode: HttpStatus.INTERNAL_SERVER_ERROR,
            message:
              'Update applicant profile service failed. Contact support!!!',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
