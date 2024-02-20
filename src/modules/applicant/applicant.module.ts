import { Module } from '@nestjs/common';
import { ApplicantController } from './applicant.controller';
import { ApplicantService } from './applicant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from './applicant.entity';
import { Admin } from '../admin/admin.entity';
import { AuthService } from '../auth/auth.service';
import { EncryptionService } from '../../utils/helpers/encryptionService';

@Module({
  imports: [TypeOrmModule.forFeature([Applicant, Admin])],
  controllers: [ApplicantController],
  providers: [ApplicantService, AuthService, EncryptionService],
  exports: [ApplicantService],
})
export class ApplicantModule {}
