import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { BaseEntity } from 'src/base.entity';

@Entity()
export class Applicant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidV4();

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', nullable: false })
  emailAddress: string;

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
}
