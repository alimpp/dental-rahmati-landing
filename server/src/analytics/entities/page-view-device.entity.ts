import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

/** One row = one device counted for a path on a calendar day. */
@Entity('page_view_devices')
@Unique(['path', 'day', 'visitorKey'])
@Index(['day'])
@Index(['path', 'day'])
export class PageViewDevice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 240 })
  path!: string;

  @Column({ length: 10 })
  day!: string;

  @Column({ name: 'visitor_key', length: 64 })
  visitorKey!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
