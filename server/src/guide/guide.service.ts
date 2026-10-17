import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuideDto, UpdateGuideDto } from './dto/guide.dto';
import { Guide } from './entities/guide.entity';
import { GUIDE_SEED } from './guide.seed';

@Injectable()
export class GuideService implements OnModuleInit {
  constructor(
    @InjectRepository(Guide)
    private readonly guideRepository: Repository<Guide>,
  ) {}

  async onModuleInit() {
    await this.seedIfEmpty();
  }

  private async seedIfEmpty() {
    for (const item of GUIDE_SEED) {
      const existing = await this.guideRepository.findOne({
        where: { slug: item.slug },
      });
      if (!existing) {
        await this.guideRepository.save(
          this.guideRepository.create({
            ...item,
            takeaways: item.takeaways ?? [],
            category: item.category ?? null,
            featured: item.featured ?? false,
            sort: item.sort ?? 0,
            isActive: item.isActive ?? true,
          }),
        );
        continue;
      }
      if ((existing.paragraphs?.length ?? 0) >= item.paragraphs.length) continue;
      Object.assign(existing, {
        title: item.title,
        excerpt: item.excerpt,
        category: item.category ?? null,
        coverImage: item.coverImage,
        paragraphs: item.paragraphs,
        takeaways: item.takeaways ?? [],
        featured: item.featured ?? existing.featured,
        sort: item.sort ?? existing.sort,
        isActive: item.isActive ?? existing.isActive,
      });
      await this.guideRepository.save(existing);
    }
  }

  async findAll(activeOnly = true) {
    const where = activeOnly ? { isActive: true } : {};
    return this.guideRepository.find({
      where,
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const item = await this.guideRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('راهنما یافت نشد');
    return item;
  }

  async findBySlug(slug: string) {
    const item = await this.guideRepository.findOne({
      where: { slug, isActive: true },
    });
    if (!item) throw new NotFoundException('راهنما یافت نشد');
    return item;
  }

  async create(dto: CreateGuideDto) {
    const exists = await this.guideRepository.findOne({
      where: { slug: dto.slug },
    });
    if (exists) throw new ConflictException('این اسلاگ قبلاً ثبت شده است');

    const item = this.guideRepository.create({
      title: dto.title,
      slug: dto.slug,
      excerpt: dto.excerpt,
      category: dto.category ?? null,
      coverImage: dto.coverImage,
      paragraphs: dto.paragraphs,
      takeaways: dto.takeaways ?? [],
      featured: dto.featured ?? false,
      sort: dto.sort ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.guideRepository.save(item);
  }

  async update(id: string, dto: UpdateGuideDto) {
    const item = await this.findOne(id);
    if (dto.slug && dto.slug !== item.slug) {
      const exists = await this.guideRepository.findOne({
        where: { slug: dto.slug },
      });
      if (exists) throw new ConflictException('این اسلاگ قبلاً ثبت شده است');
    }
    Object.assign(item, {
      ...dto,
      paragraphs: dto.paragraphs ?? item.paragraphs,
      takeaways: dto.takeaways ?? item.takeaways,
    });
    return this.guideRepository.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.guideRepository.remove(item);
    return { success: true };
  }
}
