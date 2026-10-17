import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('page_views')
@Unique(['path', 'day'])
@Index(['day'])
export class PageView {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 240 })
  path!: string;

  @Column({ length: 10 })
  day!: string;

  @Column({ type: 'int', default: 0 })
  count!: number;
}
