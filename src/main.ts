import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import { AppModule } from "./app.module";
import { config } from 'dotenv';
// import { GlobalExceptionFilter } from "./decorators/GlobalExceptionHandler";

config();

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('/api/v1');
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    app.use(cookieParser());
    app.enableCors();
    // app.useGlobalFilters(new GlobalExceptionFilter());

    (global as typeof global & { app: any }).app = app;

    await app.listen(process.env.PORT || 4000);
}

bootstrap();