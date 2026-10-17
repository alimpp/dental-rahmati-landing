import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ServiceSectionType = 'text' | 'list';

export interface ServiceSection {
  type: ServiceSectionType;
  /** Optional heading for the block */
  title?: string | null;
  /** Paragraph body when type === 'text' */
  content?: string | null;
  /** Bullet items when type === 'list' (1–10) */
  items?: string[] | null;
}

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 220 })
  slug!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 500 })
  icon!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImage!: string | null;

  /** Flexible detail blocks: text and/or numbered lists */
  @Column({ type: 'simple-json', nullable: true })
  sections!: ServiceSection[] | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  casePathTitle!: string | null;

  @Column({ type: 'text', nullable: true })
  casePathDescription!: string | null;

  @Column({ type: 'simple-json', nullable: true })
  requiredDocuments!: string[] | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  seoTitle!: string | null;

  @Column({ type: 'text', nullable: true })
  seoDescription!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  seoKeywords!: string | null;

  @Column({ type: 'int', default: 0 })
  sort!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
