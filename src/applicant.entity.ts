import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Applicant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  emailAddress: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  address: string;

  @Column()
  university: string;

  @Column()
  courseOfStudy: string;

  @Column({ type: 'float' })
  cgpa: number;

  @Column()
  cv: string;

  @Column()
  profilePix: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
