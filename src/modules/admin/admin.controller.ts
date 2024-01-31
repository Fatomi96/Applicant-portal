import { Controller, Post, Body, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { adminSigninDto } from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) { }

  @Post('/login')
  async adminLogin(
    @Body() body: adminSigninDto,
    @Res({ passthrough: true }) response,
  ) {
    const data = await this.adminService.adminSignin(body);
    response.json(data);
  }
}
