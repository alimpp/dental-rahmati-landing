import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CATALOG_SEED } from './catalog.seed';
import {
  CreateCatalogItemDto,
  UpdateCatalogItemDto,
} from './dto/catalog-item.dto';
import { CatalogItem } from './entities/catalog-item.entity';

@Injectable()
export class CatalogService implements OnModuleInit {
  constructor(
    @InjectRepository(CatalogItem)
    private readonly catalogRepository: Repository<CatalogItem>,
  ) {}

  async onModuleInit() {
    await this.seedMissing();
  }

  private async seedMissing() {
    for (const item of CATALOG_SEED) {
      const exists = await this.catalogRepository.findOne({
        where: { slug: item.slug },
      });
      if (exists) {
        exists.title = item.title;
        exists.excerpt = item.excerpt;
        exists.paragraphs = item.paragraphs;
        exists.highlights = item.highlights ?? [];
        exists.coverImage = item.coverImage;
        exists.gallery = item.gallery ?? [];
        exists.pdfs = item.pdfs;
        exists.sort = item.sort ?? exists.sort;
        await this.catalogRepository.save(exists);
        continue;
      }
      await this.catalogRepository.save(
        this.catalogRepository.create({
          ...item,
          highlights: item.highlights ?? [],
          gallery: item.gallery ?? [],
        }),
      );
    }
  }

  async findAll(activeOnly = true) {
    return this.catalogRepository.find({
      where: activeOnly ? { isActive: true } : {},
      order: { sort: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string) {
    const item = await this.catalogRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('آیتم کاتالوگ یافت نشد');
    return item;
  }

  async findBySlug(slug: string) {
    const item = await this.catalogRepository.findOne({ where: { slug } });
    if (!item) throw new NotFoundException('آیتم کاتالوگ یافت نشد');
    return item;
  }

  async create(dto: CreateCatalogItemDto) {
    const item = this.catalogRepository.create({
      ...dto,
      highlights: dto.highlights ?? [],
      gallery: dto.gallery ?? [],
      sort: dto.sort ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.catalogRepository.save(item);
  }

  async update(id: string, dto: UpdateCatalogItemDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.catalogRepository.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.catalogRepository.remove(item);
    return { success: true };
  }
}
