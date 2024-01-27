import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { EncryptionModule } from '../../helpers/encryption/encryption.module';
import { EncryptionService } from '../../helpers/encryption/encryption.service';

@Module({
  imports: [EncryptionModule, TypeOrmModule.forFeature([Admin])],
  providers: [AdminService, EncryptionService],
  controllers: [],
  exports: [AdminService],
})
export class AdminModule {}
