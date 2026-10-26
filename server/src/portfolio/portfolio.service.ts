import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePortfolioItemDto,
  UpdatePortfolioItemDto,
} from './dto/portfolio-item.dto';
import { PortfolioItem } from './entities/portfolio-item.entity';
import { PORTFOLIO_SEED } from './portfolio.seed';

@Injectable()
export class PortfolioService implements OnModuleInit {
  constructor(
    @InjectRepository(PortfolioItem)
    private readonly portfolioRepository: Repository<PortfolioItem>,
  ) {}

  async onModuleInit() {
    await this.seedMissing();
  }

  private async seedMissing() {
    const obsoleteSlugs = [
      'clinic-facade-lobby',
      'treatment-rooms',
      'digital-imaging',
      'sterile-kids',
    ];
    // keep list for one-time cleanup of old space-tour seeds
    for (const slug of obsoleteSlugs) {
      const row = await this.portfolioRepository.findOne({ where: { slug } });
      if (row) await this.portfolioRepository.remove(row);
    }

    for (const item of PORTFOLIO_SEED) {
      const exists = await this.portfolioRepository.findOne({
        where: { slug: item.slug },
      });
      if (exists) {
        Object.assign(exists, {
          title: item.title,
          treatment: item.treatment,
          patientAlias: item.patientAlias ?? null,
          description: item.description,
          coverImage: item.coverImage ?? exists.coverImage,
          beforeImage: item.beforeImage ?? exists.beforeImage,
          afterImage: item.afterImage ?? exists.afterImage,
          gallery: item.gallery,
          sort: item.sort ?? exists.sort,
          isActive: item.isActive ?? true,
        });
        await this.portfolioRepository.save(exists);
        continue;
      }
      await this.portfolioRepository.save(
        this.portfolioRepository.create({
          ...item,
          patientAlias: item.patientAlias ?? null,
          coverImage: item.coverImage ?? item.afterImage ?? null,
          beforeImage: item.beforeImage ?? null,
          afterImage: item.afterImage ?? null,
          gallery: item.gallery ?? [],
        }),
      );
    }
  }

  async findAll(activeOnly = true) {
    return this.portfolioRepository.find({
      where: activeOnly ? { isActive: true } : {},
      order: { sort: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string) {
    const item = await this.portfolioRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('نمونه کار یافت نشد');
    return item;
  }

  async findBySlug(slug: string) {
    const item = await this.portfolioRepository.findOne({
      where: { slug, isActive: true },
    });
    if (!item) throw new NotFoundException('نمونه کار یافت نشد');
    return item;
  }

  async create(dto: CreatePortfolioItemDto) {
    const item = this.portfolioRepository.create({
      ...dto,
      patientAlias: dto.patientAlias ?? null,
      coverImage:
        dto.coverImage ?? dto.afterImage ?? dto.gallery[0]?.url ?? null,
      beforeImage: dto.beforeImage ?? null,
      afterImage: dto.afterImage ?? null,
      gallery: dto.gallery ?? [],
      sort: dto.sort ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.portfolioRepository.save(item);
  }

  async update(id: string, dto: UpdatePortfolioItemDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    if (!item.coverImage) {
      item.coverImage =
        dto.afterImage ?? dto.gallery?.[0]?.url ?? item.afterImage ?? null;
    }
    return this.portfolioRepository.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.portfolioRepository.remove(item);
    return { success: true };
  }
}
