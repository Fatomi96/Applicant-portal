import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './admin.entity';
import { adminSigninDto } from './admin.dto';
import { EncryptionService } from '../../utils/helpers/encryption.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
    private encryptionService: EncryptionService,
  ) { }

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

      if (adminExists) {
        return;
      }
      const passwordHash = await this.encryptionService.encrypt(ADMIN_PASSWORD);

      const admin = await this.adminRepo.create({
        firstName: ADMIN_FIRSTNAME,
        lastName: ADMIN_LASTNAME,
        email: ADMIN_EMAIL,
        password: passwordHash,
        phoneNumber: ADMIN_MOBILE,
      });
      await this.adminRepo.save(admin);

      return {
        message: 'Success',
        statusCode: 201,
        data: null,
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            message: err.message,
            error: 'Not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async adminSignin(data: adminSigninDto) {
    try {
      const { email, password } = data;
      const admin = await this.adminRepo.findOneBy({ email });

      if (!admin) {
        throw new UnauthorizedException('Invalid Credentials');
      }
      const userPassword = await this.encryptionService.decrypt(admin.password);

      if (userPassword !== password) {
        throw new UnauthorizedException('Invalid Credentials');
      }
      const payload = { sub: admin.id, email: admin.email };

      return {
        message: 'Success',
        statusCode: 200,
        data: { ...admin, token: await this.jwtService.signAsync(payload) },
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: err.message,
            error: 'UNAUTHORIZED',
          },
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
