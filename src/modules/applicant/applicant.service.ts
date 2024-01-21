import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Applicant } from './applicant.entity';
import { createApplicantDto } from '../../interfaces/applicant.dto';
@Injectable()
export class ApplicantService {
  constructor(
    @InjectRepository(Applicant) private applicantRepo: Repository<Applicant>,
  ) {}

  async create(data: createApplicantDto): Promise<Applicant> {
    const newApplicant = this.applicantRepo.create(data);

    return this.applicantRepo.save(newApplicant);
  }

  async findOne(email: string): Promise<Applicant | null> {
    const applicant = await this.applicantRepo.findOneBy({ email });
    return applicant;
  }

  async findall(): Promise<Applicant[] | null> {
    const applicant = await this.applicantRepo.find();
    return applicant;
  }

  async update(
    id: string,
    updatedData: Partial<Applicant>,
  ): Promise<Applicant | null> {
    const existingApplicant = await this.applicantRepo.findOneBy({ id });

    if (!existingApplicant) {
      throw new NotFoundException(`Applicant with ID ${id} not found`);
    }

    const updatedApplicant = this.applicantRepo.merge(
      existingApplicant,
      updatedData,
    );
    const result = await this.applicantRepo.save(updatedApplicant);

    return result;
  }

  async remove(id: number): Promise<void> {
    await this.applicantRepo.delete(id);
  }
}
