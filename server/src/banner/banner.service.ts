import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { Banner } from './entities/banner.entity';
import { BANNER_SEED } from './banner.seed';

@Injectable()
export class BannerService implements OnModuleInit {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async onModuleInit() {
    await this.seedClinicBanners();
  }

  /**
   * Keep clinic banner seed in sync and drop leftover rows from other projects
   * (e.g. bookstore/lawyer demos that landed in this DB).
   */
  private async seedClinicBanners() {
    const seedImages = new Set(
      BANNER_SEED.map((item) => item.image).filter(Boolean) as string[],
    );

    for (const item of BANNER_SEED) {
      const exists = await this.bannerRepository.findOne({
        where: { image: item.image },
      });
      if (exists) {
        Object.assign(exists, {
          title: item.title,
          subtitle: item.subtitle ?? null,
          description: item.description ?? null,
          link: item.link ?? null,
          sort: item.sort ?? exists.sort,
          button1Text: item.button1Text ?? null,
          button1Link: item.button1Link ?? null,
          button2Text: item.button2Text ?? null,
          button2Link: item.button2Link ?? null,
          isActive: item.isActive ?? true,
        });
        await this.bannerRepository.save(exists);
        continue;
      }
      await this.bannerRepository.save(this.bannerRepository.create(item));
    }

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
