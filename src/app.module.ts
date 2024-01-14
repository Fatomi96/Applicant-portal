import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ApplicantModule } from './modules/applicant/applicant.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ILocalProcessEnv } from './interfaces/global';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from 'dotenv';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { Applicant } from './modules/applicant/applicant.entity';
config();

// const mailerOptions = {
//   transport: {
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.MAILDEV_INCOMING_USER,
//       pass: process.env.MAILDEV_INCOMING_PASS,
//     },
//   },
//   defaults: {
//     from: '"no-reply" <noreply@yourapplication.com>',
//   },
//   preview: true,
//   template: {
//     dir: __dirname + '/templates',
//     adapter: new PugAdapter(),
//     options: {
//       strict: true,
//     },
//   },
// };

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
  entities: [Applicant],
  extra: { insecureAuth: true },
  synchronize: true,
} as TypeOrmModuleOptions;

@Module({
  imports: [
    //MailerModule.forRoot(mailerOptions),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dbConfig),

    TypeOrmModule.forFeature([Applicant]),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 40,
          ttl: 60,
        },
      ],
    }),
    ApplicantModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
  exports: [AppService],
})
export class AppModule {}
