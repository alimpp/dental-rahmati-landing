import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface CatalogPdf {
  title: string;
  url: string;
}

export interface CatalogGalleryImage {
  url: string;
  caption?: string;
}

@Entity('catalog_items')
export class CatalogItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 220 })
  slug!: string;

  @Column({ type: 'text' })
  excerpt!: string;

  @Column({ type: 'simple-json' })
  paragraphs!: string[];

  @Column({ type: 'simple-json', default: '[]' })
  highlights!: string[];

  @Column({ type: 'varchar', length: 500 })
  coverImage!: string;

  @Column({ type: 'simple-json', default: '[]' })
  gallery!: CatalogGalleryImage[];

  @Column({ type: 'simple-json' })
  pdfs!: CatalogPdf[];

  @Column({ type: 'int', default: 0 })
  sort!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
