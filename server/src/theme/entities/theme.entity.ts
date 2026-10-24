import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface ThemeColors {
  primary: string;
  primarySoft: string;
  accent: string;
  surface: string;
  mist: string;
  mistDeep: string;
  ink: string;
  inkMuted: string;
}

@Entity('themes')
@Index(['slug'], { unique: true })
@Index(['isActive'])
@Index(['isDefault'])
@Index(['sort'])
export class Theme {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 80, unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'jsonb' })
  colors!: ThemeColors;

  @Column({ type: 'int', default: 0 })
  sort!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isDefault!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
