import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from 'dotenv';
import { ApplicantModule } from './modules/applicant/applicant.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ILocalProcessEnv } from './interfaces/global';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { Applicant } from './modules/applicant/applicant.entity';
import { AdminController } from './modules/admin/admin.controller';
import { AdminModule } from './modules/admin/admin.module';
import { Admin } from './modules/admin/admin.entity';
import { AuthModule } from './modules/auth/auth.module';
import { EncryptionService } from './utils/helpers/encryptionService';

config();

const {
  DB_PORT: port,
  DB_USERNAME: username,
  DB_PASSWORD: password,
  DB_HOST: host,
  DB_NAME: database,
} = process.env as typeof process.env & ILocalProcessEnv;

const dbConfig: TypeOrmModuleOptions = {
  host,
  port,
  username,
  password,
  database,
  type: 'mysql',
  entities: [Applicant, Admin],
  extra: { insecureAuth: true },
  synchronize: true,
} as TypeOrmModuleOptions;

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([Applicant, Admin]),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 40,
          ttl: 60,
        },
      ],
    }),
    ApplicantModule,
    AdminModule,
    AuthModule,
  ],
  controllers: [AppController, AuthController, AdminController],
  providers: [AppService, AuthService, EncryptionService],
  exports: [AppService],
})
export class AppModule {}
