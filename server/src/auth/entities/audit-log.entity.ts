import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  actorId!: string | null;

  @Column({ length: 80 })
  actorUsername!: string;

  @Column({ length: 40 })
  module!: string;

  @Column({ length: 20 })
  action!: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  entityId!: string | null;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'simple-json', nullable: true })
  payload!: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt!: Date;
}
