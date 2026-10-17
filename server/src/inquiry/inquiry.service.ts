import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateInquiryInput } from './inquiry.schema';
import { Inquiry } from './entities/inquiry.entity';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
  ) {}

  async create(dto: CreateInquiryInput) {
    const inquiry = this.inquiryRepository.create({
      name: dto.name.trim(),
      phone: dto.phone.trim(),
      email: dto.email?.trim() || null,
      subject: dto.subject.trim(),
      message: dto.message.trim(),
      source: dto.source || 'home',
    });
    return this.inquiryRepository.save(inquiry);
  }

  async findAll() {
    return this.inquiryRepository.find({
      order: { createdAt: 'DESC' },
      take: 200,
    });
  }

  async findOne(id: string) {
    const inquiry = await this.inquiryRepository.findOne({ where: { id } });
    if (!inquiry) throw new NotFoundException('درخواست یافت نشد');
    return inquiry;
  }

  async remove(id: string) {
    const inquiry = await this.findOne(id);
    await this.inquiryRepository.remove(inquiry);
  }
}
