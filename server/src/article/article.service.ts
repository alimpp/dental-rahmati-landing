import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ARTICLE_SEED } from './article.seed';
import {
  ArticleListQueryDto,
  CreateArticleDto,
  UpdateArticleDto,
} from './dto/article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService implements OnModuleInit {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async onModuleInit() {
    await this.seedIfEmpty();
  }

  private async seedIfEmpty() {
    for (const item of ARTICLE_SEED) {
      const existing = await this.articleRepository.findOne({
        where: { slug: item.slug },
      });

      const payload = {
        title: item.title,
        excerpt: item.excerpt,
        category: item.category,
        author: item.author,
        coverImage: item.coverImage,
        sections: item.sections ?? null,
        seoTitle: item.seoTitle ?? null,
        seoDescription: item.seoDescription ?? null,
        seoKeywords: item.seoKeywords ?? null,
        ogImage: item.ogImage ?? null,
        readingMinutes: item.readingMinutes ?? 6,
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        featured: item.featured ?? false,
        sort: item.sort ?? 0,
        isActive: item.isActive ?? true,
      };

      if (!existing) {
        await this.articleRepository.save(
          this.articleRepository.create({
            slug: item.slug,
            ...payload,
          }),
        );
        continue;
      }

      Object.assign(existing, payload);
      await this.articleRepository.save(existing);
    }
  }

  async findPaged(query: ArticleListQueryDto, activeOnly = true) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 9;
    const where: FindOptionsWhere<Article> = {};
    if (activeOnly) where.isActive = true;
    if (query.category) where.category = query.category;

    const [items, total] = await this.articleRepository.findAndCount({
      where,
      order: { featured: 'DESC', sort: 'ASC', publishedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: activeOnly ? items.map((item) => this.toListItem(item)) : items,
      total,
      page,
      limit,
      pageCount: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findFeatured(limit = 4) {
    const items = await this.articleRepository.find({
      where: { isActive: true, featured: true },
      order: { sort: 'ASC', publishedAt: 'DESC' },
      take: Math.min(Math.max(limit, 1), 8),
    });
    return items.map((item) => this.toListItem(item));
  }

  /** List/card payloads omit heavy section bodies. */
  private toListItem(item: Article): Article {
    return {
      ...item,
      sections: null,
    };
  }

  async findCategories(activeOnly = true) {
    const query = this.articleRepository
      .createQueryBuilder('article')
      .select('article.category', 'category')
      .addSelect('COUNT(article.id)', 'count')
      .groupBy('article.category')
      .orderBy('article.category', 'ASC');

    if (activeOnly) {
      query.where('article.isActive = :active', { active: true });
    }

    const rows = await query.getRawMany<{ category: string; count: string | number }>();
    return rows
      .filter((row) => Boolean(row.category))
      .map((row) => ({
        category: row.category,
        count: Number(row.count) || 0,
      }));
  }

  async findOne(id: string) {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) throw new NotFoundException('مقاله یافت نشد');
    return article;
  }

  async findBySlug(slug: string) {
    const article = await this.articleRepository.findOne({ where: { slug } });
    if (!article) throw new NotFoundException('مقاله یافت نشد');
    return article;
  }

  async create(dto: CreateArticleDto) {
    const article = this.articleRepository.create({
      ...dto,
      readingMinutes: dto.readingMinutes ?? 6,
      featured: dto.featured ?? false,
      sort: dto.sort ?? 0,
      isActive: dto.isActive ?? true,
      sections: dto.sections ?? null,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
    });
    return this.articleRepository.save(article);
  }

  async update(id: string, dto: UpdateArticleDto) {
    const article = await this.findOne(id);
    Object.assign(article, {
      ...dto,
      publishedAt:
        dto.publishedAt === undefined
          ? article.publishedAt
          : dto.publishedAt
            ? new Date(dto.publishedAt)
            : null,
    });
    return this.articleRepository.save(article);
  }

  async remove(id: string) {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
    return { success: true };
  }
}
