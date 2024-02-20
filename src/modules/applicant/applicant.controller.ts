import { Body, Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../decorators/AuthGuard';
import { ApplicantService } from './applicant.service';
import { UpdateApplicantDto } from './applicant.dto';

@Controller('applicant')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Patch('/admin/activate')
  @UseGuards(AuthGuard)
  async activateDisabledAdmin(
    @Request() request,
    @Body() updateApplicantDto: UpdateApplicantDto,
  ) {
    const email = request.user;
    const data = await this.applicantService.updateApplicantProfile(
      email,
      updateApplicantDto,
    );
    return data;
  }
}
