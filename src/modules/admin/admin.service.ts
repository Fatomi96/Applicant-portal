import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { EncryptionService } from '../../utils/helpers/encryptionService';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    private encryptionService: EncryptionService,
  ) {}

  async seedAdmin() {
    try {
      const {
        ADMIN_EMAIL,
        ADMIN_PASSWORD,
        ADMIN_FIRSTNAME,
        ADMIN_LASTNAME,
        ADMIN_MOBILE,
      } = process.env;

      if (
        !ADMIN_EMAIL ||
        !ADMIN_PASSWORD ||
        !ADMIN_FIRSTNAME ||
        !ADMIN_LASTNAME ||
        !ADMIN_MOBILE
      ) {
        throw new NotFoundException(
          'Missing seed admin environment credentials',
        );
      }

      const adminExists = await this.adminRepo.findOneBy({
        email: ADMIN_EMAIL,
      });

      if (adminExists) return;

      const passwordHash = await this.encryptionService.encrypt(ADMIN_PASSWORD);

      const admin = await this.adminRepo.create({
        firstName: ADMIN_FIRSTNAME,
        lastName: ADMIN_LASTNAME,
        email: ADMIN_EMAIL,
        password: passwordHash,
        phoneNumber: ADMIN_MOBILE,
      });

      await this.adminRepo.save(admin);

      return { message: 'Success', statusCode: 201, data: null };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            message: error.message,
            error: 'Not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message:
              'Seed Admin service Failed. Contact support for assistance!!!',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
