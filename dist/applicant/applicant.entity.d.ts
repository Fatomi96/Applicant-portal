import { BaseEntity } from 'src/common/base.entity';
export declare class Applicant extends BaseEntity {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
    phoneNumber: string;
    dateOfBirth: Date;
    address: string;
    university: string;
    courseOfStudy: string;
    cgpa: number;
    cv: string;
    image: string;
}
