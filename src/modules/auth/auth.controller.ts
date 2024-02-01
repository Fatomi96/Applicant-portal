import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from '../../decorators/auth-guard';
import { CreateApplicantDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/applicant/create')
  async createApplicant(@Body() createApplicantDto: CreateApplicantDto) {
    const data = await this.authService.createApplicant(createApplicantDto);

    return data;
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return data;
  }

  // @Get('/applicant/profile')
  // @UseGuards(AuthGuard)
  // async getApplicantInfo(@Request() req) {
  //   return req.user;
  // }
}
