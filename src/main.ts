import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { GlobalExceptionFilter } from './decorators/GlobalExceptionHandler';
import cookieParser from 'cookie-parser';
import { AdminService } from './modules/admin/admin.service';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('/api/v1');
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors();
  app.useGlobalFilters(new GlobalExceptionFilter());

  (global as typeof global & { app: any }).app = app;
  //inject the service
  const adminService = app.get(AdminService);
  await adminService.seedAdmin();

  await app.listen(process.env.PORT || 4000);
}

bootstrap();
