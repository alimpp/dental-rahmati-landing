import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface PortfolioGalleryImage {
  url: string;
  caption?: string;
}

@Entity('portfolio_items')
export class PortfolioItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 220 })
  slug!: string;

  /** نوع خدمت: لمینت، ایمپلنت، ارتودنسی، ... */
  @Column({ type: 'varchar', length: 120, default: '' })
  treatment!: string;

  /** نام مستعار بیمار برای حفظ حریم خصوصی — مثلاً «خانم م.» */
  @Column({ type: 'varchar', length: 80, nullable: true })
  patientAlias!: string | null;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImage!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  beforeImage!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  afterImage!: string | null;

  @Column({ type: 'simple-json', default: '[]' })
  gallery!: PortfolioGalleryImage[];

  @Column({ type: 'int', default: 0 })
  sort!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
