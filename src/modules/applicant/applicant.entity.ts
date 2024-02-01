import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { RoleTypes } from '../auth/auth.interface';

@Entity()
export class Applicant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  phoneNumber: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  university: string;

  @Column({ type: 'varchar', nullable: true })
  courseOfStudy: string;

  @Column({ type: 'float', nullable: true })
  cgpa: number;

  @Column({ type: 'varchar', nullable: true })
  cv: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'enum', enum: RoleTypes, nullable: true })
  role: RoleTypes;

  @Column({ type: 'bool', default: false })
  hasCompletedProfile: boolean;
}
