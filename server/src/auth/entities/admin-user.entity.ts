import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { AdminPermissions } from '../permissions';

@Entity('admin_users')
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 80 })
  username!: string;

  @Column({ length: 160 })
  displayName!: string;

  @Column({ length: 120 })
  passwordHash!: string;

  @Column({ default: false })
  isSuperAdmin!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'simple-json', nullable: true })
  permissions!: AdminPermissions | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
