import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';
import { Faq } from './entities/faq.entity';
import { FAQ_SEED } from './faq.seed';

@Injectable()
export class FaqService implements OnModuleInit {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
  ) {}

  async onModuleInit() {
    await this.seedIfEmpty();
  }

  private async seedIfEmpty() {
    for (const item of FAQ_SEED) {
      const existing = await this.faqRepository.findOne({
        where: { question: item.question },
      });
      if (existing) continue;
      await this.faqRepository.save(this.faqRepository.create(item));
    }
  }

  async findAll(activeOnly = true) {
    const where = activeOnly ? { isActive: true } : {};
    return this.faqRepository.find({
      where,
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) throw new NotFoundException('سوال یافت نشد');
    return faq;
  }

  async create(dto: CreateFaqDto) {
    const faq = this.faqRepository.create({
      ...dto,
      sort: dto.sort ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.faqRepository.save(faq);
  }

  async update(id: string, dto: UpdateFaqDto) {
    const faq = await this.findOne(id);
    Object.assign(faq, dto);
    return this.faqRepository.save(faq);
  }

  async remove(id: string) {
    const faq = await this.findOne(id);
    await this.faqRepository.remove(faq);
    return { success: true };
  }
}
