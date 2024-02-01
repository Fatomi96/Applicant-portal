// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Request } from 'express';
// // import { ApplicantService } from '../modules/applicant/applicant.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private applicantService: ApplicantService,
//   ) { }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     console.log(request.headers.authorization);
//     const token = this.extractTokenFromHeader(request);
//     if (!token) {
//       throw new UnauthorizedException('Error-----> signin again');
//     }
//     try {
//       // const applicantProfile = await this.applicantService.findOne('email');

//       request['user'] = applicantProfile;
//     } catch {
//       throw new UnauthorizedException();
//     }
//     return true;
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }
