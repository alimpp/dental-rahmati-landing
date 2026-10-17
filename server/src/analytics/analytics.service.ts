import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../article/entities/article.entity';
import { Banner } from '../banner/entities/banner.entity';
import { CatalogItem } from '../catalog/entities/catalog-item.entity';
import { Guide } from '../guide/entities/guide.entity';
import { Inquiry } from '../inquiry/entities/inquiry.entity';
import { Service } from '../service/entities/service.entity';
import { TrackViewDto } from './dto/track-view.dto';
import { PageView } from './entities/page-view.entity';

const PAGE_LABELS: Record<string, string> = {
  '/': 'خانه',
  '/about': 'درباره ما',
  '/articles': 'مقالات',
  '/guides': 'راهنماها',
  '/catalog': 'کاتالوگ',
  '/contact': 'تماس',
  '/consultation': 'مشاوره',
  '/practice-areas': 'حوزه‌های تخصصی',
};

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(PageView)
    private readonly viewRepository: Repository<PageView>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(CatalogItem)
    private readonly catalogRepository: Repository<CatalogItem>,
    @InjectRepository(Guide)
    private readonly guideRepository: Repository<Guide>,
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
  ) {}

  normalizePath(raw: string): string | null {
    let path = raw.trim();
    if (!path.startsWith('/')) path = `/${path}`;
    const q = path.indexOf('?');
    if (q >= 0) path = path.slice(0, q);
    if (path.startsWith('/admin') || path.startsWith('/api') || path.startsWith('/_')) {
      return null;
    }
    if (path.includes('.')) return null;
    path = path.replace(/\/{2,}/g, '/');
    if (path.length > 1) path = path.replace(/\/$/, '');
    return path.slice(0, 240) || '/';
  }

  async track(dto: TrackViewDto) {
    const path = this.normalizePath(dto.path);
    if (!path) return { tracked: false };
    const day = this.today();
    const existing = await this.viewRepository.findOne({ where: { path, day } });
    if (existing) {
      existing.count += 1;
      await this.viewRepository.save(existing);
    } else {
      await this.viewRepository.save(
        this.viewRepository.create({ path, day, count: 1 }),
      );
    }
    return { tracked: true };
  }

  async dashboard() {
    const days = this.lastDays(14);
    const rows = await this.viewRepository.find();
    const today = this.today();
    const weekStart = days[days.length - 7] ?? today;

    let visits = 0;
    let visitsToday = 0;
    let visitsWeek = 0;
    let articleVisits = 0;
    const byDay = new Map<string, { visits: number; articleVisits: number }>();
    const byPath = new Map<string, number>();
    const byArticle = new Map<string, number>();

    for (const row of rows) {
      visits += row.count;
      if (row.day === today) visitsToday += row.count;
      if (row.day >= weekStart) visitsWeek += row.count;
      const isArticle = row.path.startsWith('/articles');
      if (isArticle) articleVisits += row.count;

      const dayBucket = byDay.get(row.day) ?? { visits: 0, articleVisits: 0 };
      dayBucket.visits += row.count;
      if (isArticle) dayBucket.articleVisits += row.count;
      byDay.set(row.day, dayBucket);

      byPath.set(row.path, (byPath.get(row.path) ?? 0) + row.count);
      if (row.path.startsWith('/articles/') && row.path !== '/articles') {
        byArticle.set(row.path, (byArticle.get(row.path) ?? 0) + row.count);
      }
    }

    const [articleRows, catalogRows, serviceRows, guideRows] = await Promise.all([
      this.articleRepository.find({ select: { slug: true, title: true } }),
      this.catalogRepository.find({ select: { slug: true, title: true } }),
      this.serviceRepository.find({ select: { slug: true, title: true } }),
      this.guideRepository.find({ select: { slug: true, title: true } }),
    ]);

    const labels = {
      articles: new Map(articleRows.map((item) => [item.slug, item.title])),
      catalog: new Map(catalogRows.map((item) => [item.slug, item.title])),
      services: new Map(serviceRows.map((item) => [item.slug, item.title])),
      guides: new Map(guideRows.map((item) => [item.slug, item.title])),
    };

    const series = days.map((day) => ({
      day,
      visits: byDay.get(day)?.visits ?? 0,
      articleVisits: byDay.get(day)?.articleVisits ?? 0,
    }));

    const pages = [...byPath.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({
        path,
        label: this.labelFor(path, labels),
        visits: count,
      }));

    const articles = [...byArticle.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, count]) => ({
        path,
        label: this.labelFor(path, labels),
        visits: count,
      }));

    const [articlesCount, banners, services, catalog, guides, inquiries] =
      await Promise.all([
        this.articleRepository.count(),
        this.bannerRepository.count(),
        this.serviceRepository.count(),
        this.catalogRepository.count(),
        this.guideRepository.count(),
        this.inquiryRepository.count(),
      ]);

    return {
      totals: {
        visits,
        visitsToday,
        visitsWeek,
        articleVisits,
        articles: articlesCount,
        banners,
        services,
        catalog,
        guides,
        inquiries,
      },
      series,
      pages,
      articles,
    };
  }

  async reports(range: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const rows = await this.viewRepository.find();
    const buckets = this.periodKeys(range);
    const bucketSet = new Set(buckets);
    const byBucket = new Map<string, { visits: number; articleVisits: number }>();
    const byPath = new Map<string, number>();
    let visits = 0;
    let articleVisits = 0;
    let prevVisits = 0;

    const prevBuckets = this.previousPeriodKeys(range, buckets);
    const prevSet = new Set(prevBuckets);

    for (const row of rows) {
      const key = this.bucketKey(row.day, range);
      if (prevSet.has(key)) prevVisits += row.count;
      if (!bucketSet.has(key)) continue;
      visits += row.count;
      const isArticle = row.path.startsWith('/articles');
      if (isArticle) articleVisits += row.count;
      const dayBucket = byBucket.get(key) ?? { visits: 0, articleVisits: 0 };
      dayBucket.visits += row.count;
      if (isArticle) dayBucket.articleVisits += row.count;
      byBucket.set(key, dayBucket);
      byPath.set(row.path, (byPath.get(row.path) ?? 0) + row.count);
    }

    const [articleRows, catalogRows, serviceRows, guideRows] = await Promise.all([
      this.articleRepository.find({ select: { slug: true, title: true } }),
      this.catalogRepository.find({ select: { slug: true, title: true } }),
      this.serviceRepository.find({ select: { slug: true, title: true } }),
      this.guideRepository.find({ select: { slug: true, title: true } }),
    ]);
    const labels = {
      articles: new Map(articleRows.map((item) => [item.slug, item.title])),
      catalog: new Map(catalogRows.map((item) => [item.slug, item.title])),
      services: new Map(serviceRows.map((item) => [item.slug, item.title])),
      guides: new Map(guideRows.map((item) => [item.slug, item.title])),
    };

    const changePercent =
      prevVisits === 0 ? (visits > 0 ? 100 : 0) : ((visits - prevVisits) / prevVisits) * 100;

    return {
      range,
      totals: {
        visits,
        articleVisits,
        uniquePaths: byPath.size,
        prevVisits,
        changePercent: Math.round(changePercent * 10) / 10,
      },
      series: buckets.map((day) => ({
        day,
        visits: byBucket.get(day)?.visits ?? 0,
        articleVisits: byBucket.get(day)?.articleVisits ?? 0,
      })),
      pages: [...byPath.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([path, count]) => ({
          path,
          label: this.labelFor(path, labels),
          visits: count,
        })),
    };
  }

  private labelFor(
    path: string,
    labels: {
      articles: Map<string, string>;
      catalog: Map<string, string>;
      services: Map<string, string>;
      guides: Map<string, string>;
    },
  ) {
    if (PAGE_LABELS[path]) return PAGE_LABELS[path];
    if (path.startsWith('/articles/')) {
      const slug = decodeURIComponent(path.slice('/articles/'.length));
      return labels.articles.get(slug) || `مقاله ${slug}`;
    }
    if (path.startsWith('/guides/')) {
      const slug = decodeURIComponent(path.slice('/guides/'.length));
      return labels.guides.get(slug) || `راهنما ${slug}`;
    }
    if (path.startsWith('/guides')) {
      return 'راهنماها';
    }
    if (path.startsWith('/catalog/')) {
      const slug = decodeURIComponent(path.slice('/catalog/'.length));
      return labels.catalog.get(slug) || `کاتالوگ ${slug}`;
    }
    if (path.startsWith('/practice-areas/')) {
      const slug = decodeURIComponent(path.slice('/practice-areas/'.length));
      return labels.services.get(slug) || `خدمت ${slug}`;
    }
    return path;
  }

  private today() {
    return new Date().toISOString().slice(0, 10);
  }

  private lastDays(count: number) {
    const days: string[] = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }

  private weekStart(iso: string) {
    const d = new Date(`${iso}T12:00:00`);
    const offset = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - offset);
    return d.toISOString().slice(0, 10);
  }

  private bucketKey(iso: string, range: 'daily' | 'weekly' | 'monthly') {
    if (range === 'weekly') return this.weekStart(iso);
    if (range === 'monthly') return iso.slice(0, 7);
    return iso;
  }

  private periodKeys(range: 'daily' | 'weekly' | 'monthly') {
    if (range === 'daily') return this.lastDays(30);
    if (range === 'monthly') {
      const keys: string[] = [];
      const now = new Date();
      for (let i = 11; i >= 0; i -= 1) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
      }
      return keys;
    }
    const keys: string[] = [];
    const today = this.today();
    let cursor = this.weekStart(today);
    for (let i = 0; i < 12; i += 1) {
      keys.unshift(cursor);
      const d = new Date(`${cursor}T12:00:00`);
      d.setDate(d.getDate() - 7);
      cursor = d.toISOString().slice(0, 10);
    }
    return keys;
  }

  private previousPeriodKeys(
    range: 'daily' | 'weekly' | 'monthly',
    current: string[],
  ) {
    if (!current.length) return [];
    if (range === 'daily') {
      const first = new Date(`${current[0]}T12:00:00`);
      first.setDate(first.getDate() - 1);
      const days: string[] = [];
      for (let i = current.length - 1; i >= 0; i -= 1) {
        const d = new Date(first);
        d.setDate(first.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
      }
      return days;
    }
    if (range === 'weekly') {
      const keys: string[] = [];
      let cursor = current[0];
      for (let i = 0; i < current.length; i += 1) {
        const d = new Date(`${cursor}T12:00:00`);
        d.setDate(d.getDate() - 7);
        cursor = d.toISOString().slice(0, 10);
        keys.unshift(cursor);
      }
      return keys;
    }
    const keys: string[] = [];
    const [year, month] = current[0].split('-').map(Number);
    const start = new Date(year, month - 1 - current.length, 1);
    for (let i = 0; i < current.length; i += 1) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return keys;
  }
}
