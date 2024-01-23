import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { adminSigninDto } from '../../DTOs/admin-DTO/admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async seedAdmin() {
    try {
      const adminExists = await this.adminRepo.findOneBy({
        email: process.env.ADMIN_EMAIL,
      });

      if (adminExists) {
        console.log('This admin is registered');
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

      const admin = await this.adminRepo.create({
        firstName: process.env.ADMIN_FIRSTNAME,
        lastName: process.env.ADMIN_LASTNAME,
        email: process.env.ADMIN_EMAIL,
        password: passwordHash,
        phoneNumber: process.env.ADMIN_MOBILE,
      });
      await this.adminRepo.save(admin);
    } catch (err) {
      console.log(err);
    }
  }

  async adminSignin(data: adminSigninDto) {
    try {
      const { email, password } = data;

      const admin = await this.adminRepo.findOneBy({ email });

      if (!admin) {
        throw new UnauthorizedException('Invalid Credentials');
      }
      const userPassword = await bcrypt.compare(password, admin.password);

      if (!userPassword) {
        throw new UnauthorizedException('Invalid Credentials');
      }
      const payload = { sub: admin.id, email: admin.email };

      return {
        message: 'Success',
        statusCode: 200,
        data: { ...admin, token: await this.jwtService.signAsync(payload) },
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }
}
