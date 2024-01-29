import { Module } from '@nestjs/common';
import { ApplicantController } from './applicant.controller';
import { ApplicantService } from './applicant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from './applicant.entity';
import { EncryptionModule } from '../../helpers/encryption/encryption.module';
import { EncryptionService } from '../../helpers/encryption/encryption.service';

@Module({
  imports: [EncryptionModule, TypeOrmModule.forFeature([Applicant])],
  controllers: [ApplicantController],
  providers: [ApplicantService, EncryptionService],
  exports: [ApplicantService],
})
export class ApplicantModule {}
