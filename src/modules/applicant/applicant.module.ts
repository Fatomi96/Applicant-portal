import { Module } from '@nestjs/common';
import { ApplicantController } from './applicant.controller';
import { ApplicantService } from './applicant.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [ApplicantController],
  providers: [ApplicantService],
  exports: [ApplicantService],
})
export class ApplicantModule {}
