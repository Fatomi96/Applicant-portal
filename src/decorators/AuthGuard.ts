import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Logger from '../utils/helpers/Logger';
import { EncryptionService } from '../utils/helpers/encryptionService';
import { Admin } from '../modules/admin/admin.entity';
import { Applicant } from '../modules/applicant/applicant.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Applicant)
    private applicantRepository: Repository<Applicant>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization } = request.headers;

      if (!authorization || !authorization.startsWith('Bearer')) {
        Logger.warn(
          'Invalid or missing authorization token, kindly login to continue',
        );
        throw new UnauthorizedException(
          'Invalid or missing authorization token, kindly login to continue',
        );
      }

      const token = authorization.split(' ')[1];
      const encryptionService = new EncryptionService();

      const decodedToken = JSON.parse(await encryptionService.decrypt(token));
      const currentTimestamp = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
        Logger.warn(
          'Authorization token has expired, kindly login to continue',
        );
        throw new UnauthorizedException(
          'Athorization token has expired, kindly login to continue',
        );
      }

      let user: any;

      user = await this.applicantRepository.findOneBy({
        email: decodedToken.email,
      });

      if (!user)
        user = await this.adminRepository.findOneBy({
          email: decodedToken.email,
        });

      if (!user) {
        Logger.warn('Account with this details not found');
        throw new NotFoundException('Account with this details not found');
      }

      request.user = decodedToken;
      return request.user;
    } catch (error) {
      Logger.error(error.message);
      if (error instanceof UnauthorizedException) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: error.message,
            error: 'UNAUTHORIZED ACCESS',
          },
          HttpStatus.UNAUTHORIZED,
        );
      } else if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            message: error.message,
            error: 'NOT FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      } else if (error instanceof ForbiddenException) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            message: error.message,
            error: 'FORBIDDEN',
          },
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Authorization service failed, contact support!!!',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
