import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppointmentSlot } from './appointment-slot.entity';

@Entity('appointment_bookings')
export class AppointmentBooking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  slotId!: string;

  @OneToOne(() => AppointmentSlot, (slot) => slot.booking, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'slotId' })
  slot!: AppointmentSlot;

  @Column({ type: 'varchar', length: 80 })
  firstName!: string;

  @Column({ type: 'varchar', length: 80 })
  lastName!: string;

  @Column({ type: 'varchar', length: 40 })
  phone!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
