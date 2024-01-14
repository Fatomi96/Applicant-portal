import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApplicantService } from '../applicant/applicant.service';
import { createApplicantDto } from '../../interfaces/applicant.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private applicantService: ApplicantService,
  ) {}

  @Post('/signup')
  async applicantSignup(
    @Body() body: createApplicantDto,
    @Res({ passthrough: true }) response,
  ) {
    const data = await this.authService.signup(body);

    response.json(data);
  }
}
