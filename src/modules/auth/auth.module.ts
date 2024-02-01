import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Admin } from '../admin/admin.entity';
import { Applicant } from '../applicant/applicant.entity';
import { EncryptionService } from '../../utils/helpers/encryptionService';

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin, Applicant, EncryptionService]),
    ],
    controllers: [AuthController],
    providers: [AuthService, Admin, Applicant, EncryptionService],
    exports: [AuthService],
})

export class AuthModule { }