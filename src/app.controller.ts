import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/')
export class AppController {
  constructor() {}

  @Get('/')
  async entry(@Req() req: Request, @Res() resp: Response) {
    resp.json({ status: 'okay', description: 'server is up and running' });
  }
}
