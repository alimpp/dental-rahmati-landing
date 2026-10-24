import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateThemeDto,
  QueryThemeDto,
  UpdateThemeDto,
} from './dto/theme.dto';
import { Theme, type ThemeColors } from './entities/theme.entity';
import { THEME_SEED } from './theme.seed';

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase().replace(/\s+/g, '-');
}

function normalizeHex(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith('#')) return `#${trimmed}`;
  return trimmed;
}

function normalizeColors(colors: ThemeColors): ThemeColors {
  return {
    primary: normalizeHex(colors.primary),
    primarySoft: normalizeHex(colors.primarySoft),
    accent: normalizeHex(colors.accent),
    surface: normalizeHex(colors.surface),
    mist: normalizeHex(colors.mist),
    mistDeep: normalizeHex(colors.mistDeep),
    ink: normalizeHex(colors.ink),
    inkMuted: normalizeHex(colors.inkMuted),
  };
}

@Injectable()
export class ThemeService implements OnModuleInit {
  constructor(
    @InjectRepository(Theme)
    private readonly themeRepo: Repository<Theme>,
  ) {}

  async onModuleInit() {
    await this.seedIfEmpty();
  }

  private async seedIfEmpty() {
    for (const item of THEME_SEED) {
      const existing = await this.themeRepo.findOne({
        where: { slug: item.slug },
      });
      if (!existing) {
        await this.themeRepo.save(
          this.themeRepo.create({
            ...item,
            colors: normalizeColors(item.colors),
          }),
        );
        continue;
      }

      Object.assign(existing, {
        name: item.name,
        description: item.description,
        colors: normalizeColors(item.colors),
        sort: item.sort,
        isActive: item.isActive,
        isDefault: item.isDefault,
      });
      await this.themeRepo.save(existing);
    }

    const defaults = await this.themeRepo.find({ where: { isDefault: true } });
    if (defaults.length === 0) {
      const fallback =
        (await this.themeRepo.findOne({ where: { slug: 'clinic-teal' } })) ||
        (await this.themeRepo.findOne({ where: { isActive: true }, order: { sort: 'ASC' } }));
      if (fallback) {
        fallback.isDefault = true;
        await this.themeRepo.save(fallback);
      }
    } else if (defaults.length > 1) {
      const preferred =
        defaults.find((d) => d.slug === 'clinic-teal') || defaults[0]!;
      for (const row of defaults) {
        if (row.id === preferred.id) continue;
        row.isDefault = false;
        await this.themeRepo.save(row);
      }
    }
  }

  async findAll(query: QueryThemeDto = {}) {
    const qb = this.themeRepo
      .createQueryBuilder('theme')
      .orderBy('theme.sort', 'ASC')
      .addOrderBy('theme.createdAt', 'ASC');

    if (!query.all) {
      qb.andWhere('theme.isActive = true');
    }

    return (await qb.getMany()).map((item) => this.toResponse(item));
  }

  async findDefault() {
    const preferred = await this.themeRepo.findOne({
      where: { isDefault: true, isActive: true },
      order: { sort: 'ASC' },
    });
    if (preferred) return this.toResponse(preferred);

    const first = await this.themeRepo.findOne({
      where: { isActive: true },
      order: { sort: 'ASC', createdAt: 'ASC' },
    });
    if (!first) throw new NotFoundException('تم پیش‌فرض یافت نشد');
    return this.toResponse(first);
  }

  async findOne(id: string) {
    const item = await this.themeRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('تم یافت نشد');
    return this.toResponse(item);
  }

  async create(dto: CreateThemeDto) {
    const slug = normalizeSlug(dto.slug);
    if (await this.themeRepo.exists({ where: { slug } })) {
      throw new BadRequestException('این اسلاگ قبلاً ثبت شده است');
    }

    const entity = this.themeRepo.create({
      name: dto.name.trim(),
      slug,
      description: dto.description?.trim() || null,
      colors: normalizeColors(dto.colors),
      sort: dto.sort ?? 0,
      isActive: dto.isActive !== false,
      isDefault: Boolean(dto.isDefault),
    });

    const saved = await this.themeRepo.save(entity);
    if (saved.isDefault) await this.clearDefaultExcept(saved.id);
    return this.toResponse(saved);
  }

  async update(id: string, dto: UpdateThemeDto) {
    const item = await this.themeRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('تم یافت نشد');

    if (dto.name !== undefined) item.name = dto.name.trim();
    if (dto.slug !== undefined) {
      const slug = normalizeSlug(dto.slug);
      const exists = await this.themeRepo.findOne({ where: { slug } });
      if (exists && exists.id !== id) {
        throw new BadRequestException('این اسلاگ قبلاً ثبت شده است');
      }
      item.slug = slug;
    }
    if (dto.description !== undefined) {
      item.description = dto.description?.trim() || null;
    }
    if (dto.colors !== undefined) item.colors = normalizeColors(dto.colors);
    if (dto.sort !== undefined) item.sort = dto.sort;
    if (dto.isActive !== undefined) item.isActive = dto.isActive;
    if (dto.isDefault !== undefined) item.isDefault = dto.isDefault;

    if (item.isDefault && !item.isActive) {
      throw new BadRequestException('تم پیش‌فرض نمی‌تواند غیرفعال باشد');
    }

    const saved = await this.themeRepo.save(item);
    if (saved.isDefault) await this.clearDefaultExcept(saved.id);
    return this.toResponse(saved);
  }

  async remove(id: string) {
    const item = await this.themeRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('تم یافت نشد');
    if (item.isDefault) {
      throw new BadRequestException('تم پیش‌فرض قابل حذف نیست');
    }
    await this.themeRepo.remove(item);
    return { id, deleted: true };
  }

  private async clearDefaultExcept(id: string) {
    const defaults = await this.themeRepo.find({ where: { isDefault: true } });
    for (const item of defaults) {
      if (item.id === id) continue;
      item.isDefault = false;
      await this.themeRepo.save(item);
    }
  }

  private toResponse(item: Theme) {
    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      colors: item.colors,
      sort: item.sort,
      isActive: item.isActive,
      isDefault: item.isDefault,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
