import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Admin } from '../admin/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
    ],
    controllers: [AuthController],
    providers: [AuthService, Admin],
    exports: [AuthService],
})
export class AuthModule { }
