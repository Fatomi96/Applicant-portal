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
import { ApplicantService } from '../applicant/applicant.service';
import {
  createApplicantDto,
  signinApplicantDto,
} from '../applicant/applicant.dto';
import { AuthGuard } from '../../decorators/auth-guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private applicantService: ApplicantService,
  ) { }

  @Post('/applicant/signup')
  async applicantSignup(
    @Body() body: createApplicantDto,
    @Res({ passthrough: true }) response,
  ) {
    const data = await this.authService.signup(body);

    response.json(data);
  }

  @Post('/applicant/signin')
  async applicantSignin(
    @Body() body: signinApplicantDto,
    @Res({ passthrough: true }) response,
  ) {
    const data = await this.authService.signin(body);
    response.json(data);
  }

  @Get('/applicant/profile')
  @UseGuards(AuthGuard)
  async getApplicantInfo(@Request() req) {
    return req.user;
  }
}
