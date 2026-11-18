import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateClinicRoomDto,
  UpdateClinicRoomDto,
} from './dto/clinic-room.dto';
import { ClinicRoom } from './entities/clinic-room.entity';

@Injectable()
export class ClinicRoomService implements OnModuleInit {
  private readonly logger = new Logger(ClinicRoomService.name);

  constructor(
    @InjectRepository(ClinicRoom)
    private readonly clinicRoomRepository: Repository<ClinicRoom>,
  ) {}

  async onModuleInit() {
    // Production has DB_SYNCHRONIZE=false — ensure clinic_rooms exists.
    try {
      await this.clinicRoomRepository.query(`
        CREATE TABLE IF NOT EXISTS clinic_rooms (
          id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
          eyebrow character varying(120) NOT NULL,
          title character varying(200) NOT NULL,
          description text NOT NULL,
          image character varying(500) NOT NULL,
          sort integer DEFAULT 0 NOT NULL,
          "isActive" boolean DEFAULT true NOT NULL,
          "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
          "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
          CONSTRAINT "PK_clinic_rooms_id" PRIMARY KEY (id)
        );
      `);
      await this.clinicRoomRepository.query(`
        CREATE INDEX IF NOT EXISTS idx_clinic_rooms_sort
          ON clinic_rooms (sort);
      `);
    }
    catch (err) {
      this.logger.warn(
        `clinic_rooms bootstrap skipped: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  async findAll(activeOnly = true) {
    const where = activeOnly ? { isActive: true } : {};
    return this.clinicRoomRepository.find({
      where,
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const room = await this.clinicRoomRepository.findOne({ where: { id } });
    if (!room) throw new NotFoundException('فضای کلینیک یافت نشد');
    return room;
  }

  async create(dto: CreateClinicRoomDto) {
    const room = this.clinicRoomRepository.create({
      ...dto,
      sort: dto.sort ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.clinicRoomRepository.save(room);
  }

  async update(id: string, dto: UpdateClinicRoomDto) {
    const room = await this.findOne(id);
    Object.assign(room, dto);
    return this.clinicRoomRepository.save(room);
  }

  async remove(id: string) {
    const room = await this.findOne(id);
    await this.clinicRoomRepository.remove(room);
    return { success: true };
  }
}
