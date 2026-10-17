import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ArticleSectionType = 'text' | 'list' | 'image';

export interface ArticleSection {
  type: ArticleSectionType;
  title?: string | null;
  content?: string | null;
  items?: string[] | null;
  src?: string | null;
  alt?: string | null;
  caption?: string | null;
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 220 })
  title!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 240 })
  slug!: string;

  @Column({ type: 'text' })
  excerpt!: string;

  @Column({ type: 'varchar', length: 80 })
  category!: string;

  @Column({ type: 'varchar', length: 120 })
  author!: string;

  @Column({ type: 'varchar', length: 500 })
  coverImage!: string;

  @Column({ type: 'simple-json', nullable: true })
  sections!: ArticleSection[] | null;

  @Column({ type: 'varchar', length: 220, nullable: true })
  seoTitle!: string | null;

  @Column({ type: 'text', nullable: true })
  seoDescription!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  seoKeywords!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  ogImage!: string | null;

  @Column({ type: 'int', default: 6 })
  readingMinutes!: number;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt!: Date | null;

  @Column({ type: 'boolean', default: false })
  featured!: boolean;

  @Column({ type: 'int', default: 0 })
  sort!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
