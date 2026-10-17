import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
} from './dto/testimonial.dto';
import { Testimonial } from './entities/testimonial.entity';
import { TESTIMONIAL_SEED } from './testimonial.seed';

@Injectable()
export class TestimonialService implements OnModuleInit {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
  ) {}

  async onModuleInit() {
    await this.seedIfEmpty();
  }

  private async seedIfEmpty() {
    const count = await this.testimonialRepository.count();
    if (count > 0) return;

    await this.testimonialRepository.save(
      TESTIMONIAL_SEED.map((item) => this.testimonialRepository.create(item)),
    );
  }

  async findAll(activeOnly = true) {
    const where = activeOnly ? { isActive: true } : {};
    return this.testimonialRepository.find({
      where,
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const testimonial = await this.testimonialRepository.findOne({
      where: { id },
    });
    if (!testimonial) throw new NotFoundException('نظر یافت نشد');
    return testimonial;
  }

  async create(dto: CreateTestimonialDto) {
    const testimonial = this.testimonialRepository.create({
      ...dto,
      sort: dto.sort ?? 0,
      isActive: dto.isActive ?? true,
      featured: dto.featured ?? true,
    });
    return this.testimonialRepository.save(testimonial);
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    const testimonial = await this.findOne(id);
    Object.assign(testimonial, dto);
    return this.testimonialRepository.save(testimonial);
  }

  async remove(id: string) {
    const testimonial = await this.findOne(id);
    await this.testimonialRepository.remove(testimonial);
    return { success: true };
  }
}
