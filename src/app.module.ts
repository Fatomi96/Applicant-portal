import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ILocalProcessEnv } from './interfaces/global';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from 'dotenv';

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
  entities: [],
  extra: { insecureAuth: true },
  synchronize: true,
} as TypeOrmModuleOptions;

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([]),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 40,
          ttl: 60,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
