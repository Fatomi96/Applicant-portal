import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto } from '../applicant/applicant.dto';
import { AuthGuard } from '../../decorators/auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/applicant/create')
  async createApplicant(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.createApplicant(signUpDto);

    return data;
  }

  @Post('/login')
  async applicantSignin(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return data;
  }

  @Get('/applicant/profile')
  @UseGuards(AuthGuard)
  async getApplicantInfo(@Request() req) {
    return req.user;
  }
}
