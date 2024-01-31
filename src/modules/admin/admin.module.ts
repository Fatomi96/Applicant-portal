import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { EncryptionService } from '../../utils/helpers/encryptionService';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminService, EncryptionService],
  controllers: [],
  exports: [AdminService],
})
export class AdminModule { }
