import { Module } from '@nestjs/common';
import { ApplicantController } from './applicant.controller';
import { ApplicantService } from './applicant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from 'src/applicant/applicant.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Applicant])],
  controllers: [ApplicantController],
  providers: [ApplicantService],
})
export class ApplicantModule {}
