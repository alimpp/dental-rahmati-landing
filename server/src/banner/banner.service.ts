import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { access, copyFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { Repository } from 'typeorm';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { Banner } from './entities/banner.entity';
import { BANNER_SEED } from './banner.seed';

@Injectable()
export class BannerService implements OnModuleInit {
  private readonly logger = new Logger(BannerService.name);

  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async onModuleInit() {
    await this.ensureSeedMedia();
    await this.seedClinicBanners();
  }

  /** Copy tracked motion clips into uploads (served by Nest). */
  private async ensureSeedMedia() {
    const files = [
      'banner-ppe.mp4',
      'banner-assist.mp4',
      'banner-arrive.mp4',
      'banner-clean.mp4',
    ];
    await mkdir(join(process.cwd(), 'uploads', 'images'), { recursive: true });
    for (const name of files) {
      const from = join(process.cwd(), 'assets', 'banners', name);
      const to = join(process.cwd(), 'uploads', 'images', name);
      try {
        await access(from);
        await copyFile(from, to);
      }
      catch {
        this.logger.warn(`Banner seed media missing: ${from}`);
      }
    }
  }

  /**
   * Insert missing clinic banners only. Never overwrite admin edits (isActive,
   * titles, links, sort). Only remove obvious leftover rows from other projects.
   */
  private async seedClinicBanners() {
    for (const item of BANNER_SEED) {
      const exists = await this.bannerRepository.findOne({
        where: { image: item.image },
      });
      if (exists) continue;
      await this.bannerRepository.save(this.bannerRepository.create(item));
    }

    const seedImages = new Set(
      BANNER_SEED.map((item) => item.image).filter(Boolean) as string[],
    );
    const all = await this.bannerRepository.find();
    for (const row of all) {
      const foreign =
        !seedImages.has(row.image) &&
        (row.image.startsWith('/images/') ||
          /کتاب|کتابینو|وکیل|دادسر|dadsar|ketab/i.test(
            `${row.title} ${row.subtitle ?? ''} ${row.description ?? ''}`,
          ));
      if (foreign) {
        await this.bannerRepository.remove(row);
      }
    }
  }

  async findAll(activeOnly = true) {
    const where = activeOnly ? { isActive: true } : {};
    return this.bannerRepository.find({
      where,
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) throw new NotFoundException('بنر یافت نشد');
    return banner;
  }

  async create(dto: CreateBannerDto) {
    const banner = this.bannerRepository.create({
      ...dto,
      sort: dto.sort ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.bannerRepository.save(banner);
  }

  async update(id: string, dto: UpdateBannerDto) {
    const banner = await this.findOne(id);
    Object.assign(banner, dto);
    return this.bannerRepository.save(banner);
  }

  async remove(id: string) {
    const banner = await this.findOne(id);
    await this.bannerRepository.remove(banner);
    return { success: true };
  }
}
