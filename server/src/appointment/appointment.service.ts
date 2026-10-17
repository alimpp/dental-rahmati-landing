import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import type { CreateBookingInput } from './appointment.schema';
import {
  BulkCreateSlotsDto,
  CreateSlotDto,
  UpdateSlotDto,
} from './dto/appointment.dto';
import { AppointmentBooking } from './entities/appointment-booking.entity';
import { AppointmentSlot } from './entities/appointment-slot.entity';

function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function timeToMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

function assertValidRange(startTime: string, endTime: string) {
  if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
    throw new BadRequestException('ساعت پایان باید بعد از ساعت شروع باشد');
  }
}

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(AppointmentSlot)
    private readonly slotRepository: Repository<AppointmentSlot>,
    @InjectRepository(AppointmentBooking)
    private readonly bookingRepository: Repository<AppointmentBooking>,
    private readonly dataSource: DataSource,
  ) {}

  private toPublicSlot(slot: AppointmentSlot, booked = false) {
    return {
      id: slot.id,
      date: String(slot.date).slice(0, 10),
      startTime: slot.startTime,
      endTime: slot.endTime,
      isActive: slot.isActive,
      isBooked: booked,
      label: `${slot.startTime} تا ${slot.endTime}`,
    };
  }

  async createSlot(dto: CreateSlotDto) {
    assertValidRange(dto.startTime, dto.endTime);
    const slot = this.slotRepository.create({
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      isActive: dto.isActive ?? true,
    });
    try {
      return await this.slotRepository.save(slot);
    } catch {
      throw new ConflictException('این بازه زمانی برای این روز قبلاً ثبت شده است');
    }
  }

  async createSlotsBulk(dto: BulkCreateSlotsDto) {
    for (const range of dto.slots) {
      assertValidRange(range.startTime, range.endTime);
    }

    const created: AppointmentSlot[] = [];
    for (const range of dto.slots) {
      const existing = await this.slotRepository.findOne({
        where: {
          date: dto.date,
          startTime: range.startTime,
          endTime: range.endTime,
        },
      });
      if (existing) {
        if (!existing.isActive) {
          existing.isActive = true;
          created.push(await this.slotRepository.save(existing));
        }
        continue;
      }
      const slot = this.slotRepository.create({
        date: dto.date,
        startTime: range.startTime,
        endTime: range.endTime,
        isActive: true,
      });
      created.push(await this.slotRepository.save(slot));
    }
    return created;
  }

  async updateSlot(id: string, dto: UpdateSlotDto) {
    const slot = await this.findSlotEntity(id);
    const start = dto.startTime ?? slot.startTime;
    const end = dto.endTime ?? slot.endTime;
    assertValidRange(start, end);
    Object.assign(slot, {
      date: dto.date ?? slot.date,
      startTime: start,
      endTime: end,
      isActive: dto.isActive ?? slot.isActive,
    });
    try {
      return await this.slotRepository.save(slot);
    } catch {
      throw new ConflictException('این بازه زمانی با نوبت دیگری تداخل دارد');
    }
  }

  async removeSlot(id: string) {
    const slot = await this.slotRepository.findOne({
      where: { id },
      relations: { booking: true },
    });
    if (!slot) throw new NotFoundException('نوبت یافت نشد');
    if (slot.booking) {
      throw new BadRequestException(
        'این نوبت رزرو شده است؛ ابتدا رزرو را لغو کنید',
      );
    }
    await this.slotRepository.remove(slot);
  }

  async findSlotEntity(id: string) {
    const slot = await this.slotRepository.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('نوبت یافت نشد');
    return slot;
  }

  /** Admin: all slots with booking summary. */
  async findAllSlotsAdmin(date?: string) {
    const qb = this.slotRepository
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.booking', 'booking')
      .orderBy('slot.date', 'ASC')
      .addOrderBy('slot.startTime', 'ASC');

    if (date) {
      qb.andWhere('slot.date = :date', { date });
    }

    const rows = await qb.getMany();
    return rows.map((slot) => ({
      ...this.toPublicSlot(slot, Boolean(slot.booking)),
      booking: slot.booking
        ? {
            id: slot.booking.id,
            firstName: slot.booking.firstName,
            lastName: slot.booking.lastName,
            phone: slot.booking.phone,
            notes: slot.booking.notes,
            createdAt: slot.booking.createdAt,
          }
        : null,
      createdAt: slot.createdAt,
      updatedAt: slot.updatedAt,
    }));
  }

  /** Public: available (active + not booked + today or future). */
  async findAvailableSlots(from?: string, to?: string) {
    const start = from && from >= todayIso() ? from : todayIso();

    const qb = this.slotRepository
      .createQueryBuilder('slot')
      .leftJoin('slot.booking', 'booking')
      .where('slot.isActive = true')
      .andWhere('slot.date >= :start', { start })
      .andWhere('booking.id IS NULL')
      .orderBy('slot.date', 'ASC')
      .addOrderBy('slot.startTime', 'ASC');

    if (to) {
      qb.andWhere('slot.date <= :to', { to });
    }

    const rows = await qb.getMany();
    return rows.map((slot) => this.toPublicSlot(slot, false));
  }

  async findAvailableDates(from?: string, to?: string) {
    const slots = await this.findAvailableSlots(from, to);
    const map = new Map<string, number>();
    for (const slot of slots) {
      map.set(slot.date, (map.get(slot.date) ?? 0) + 1);
    }
    return [...map.entries()].map(([date, count]) => ({ date, count }));
  }

  async book(dto: CreateBookingInput) {
    return this.dataSource.transaction(async (manager) => {
      const slot = await manager
        .getRepository(AppointmentSlot)
        .createQueryBuilder('slot')
        .setLock('pessimistic_write')
        .where('slot.id = :id', { id: dto.slotId })
        .getOne();

      if (!slot || !slot.isActive) {
        throw new NotFoundException('این نوبت در دسترس نیست');
      }
      if (String(slot.date).slice(0, 10) < todayIso()) {
        throw new BadRequestException('امکان رزرو نوبت گذشته وجود ندارد');
      }

      const existing = await manager.getRepository(AppointmentBooking).findOne({
        where: { slotId: slot.id },
      });
      if (existing) {
        throw new ConflictException(
          'این نوبت همین الان رزرو شد؛ لطفاً نوبت دیگری انتخاب کنید',
        );
      }

      const booking = manager.getRepository(AppointmentBooking).create({
        slotId: slot.id,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        phone: dto.phone.trim(),
        notes: dto.notes?.trim() || null,
      });

      try {
        const saved = await manager.getRepository(AppointmentBooking).save(booking);
        return {
          id: saved.id,
          firstName: saved.firstName,
          lastName: saved.lastName,
          phone: saved.phone,
          notes: saved.notes,
          createdAt: saved.createdAt,
          slot: this.toPublicSlot(slot, true),
        };
      } catch {
        throw new ConflictException(
          'این نوبت همین الان رزرو شد؛ لطفاً نوبت دیگری انتخاب کنید',
        );
      }
    });
  }

  async findAllBookings() {
    const rows = await this.bookingRepository.find({
      relations: { slot: true },
      order: { createdAt: 'DESC' },
      take: 500,
    });
    return rows.map((booking) => ({
      id: booking.id,
      firstName: booking.firstName,
      lastName: booking.lastName,
      phone: booking.phone,
      notes: booking.notes,
      createdAt: booking.createdAt,
      slot: booking.slot
        ? this.toPublicSlot(booking.slot, true)
        : null,
    }));
  }

  async findBooking(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { slot: true },
    });
    if (!booking) throw new NotFoundException('رزرو یافت نشد');
    return booking;
  }

  async removeBooking(id: string) {
    const booking = await this.findBooking(id);
    await this.bookingRepository.remove(booking);
  }
}
