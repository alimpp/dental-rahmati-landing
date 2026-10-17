import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppointmentBooking } from './appointment-booking.entity';

@Entity('appointment_slots')
@Index(['date', 'startTime', 'endTime'], { unique: true })
export class AppointmentSlot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** Calendar day in YYYY-MM-DD (Gregorian). */
  @Column({ type: 'date' })
  date!: string;

  /** HH:mm */
  @Column({ type: 'varchar', length: 5 })
  startTime!: string;

  /** HH:mm */
  @Column({ type: 'varchar', length: 5 })
  endTime!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToOne(() => AppointmentBooking, (booking) => booking.slot)
  booking?: AppointmentBooking | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
