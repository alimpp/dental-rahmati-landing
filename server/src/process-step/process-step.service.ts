import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateProcessStepDto,
  UpdateProcessStepDto,
} from './dto/process-step.dto';
import { ProcessStep } from './entities/process-step.entity';
import { PROCESS_STEP_SEED } from './process-step.seed';

@Injectable()
export class ProcessStepService implements OnModuleInit {
  constructor(
    @InjectRepository(ProcessStep)
    private readonly processStepRepository: Repository<ProcessStep>,
  ) {}

  async onModuleInit() {
    await this.seedIfEmpty();
  }

  private async seedIfEmpty() {
    const count = await this.processStepRepository.count();
    if (count > 0) return;

    await this.processStepRepository.save(
      PROCESS_STEP_SEED.map((item) => this.processStepRepository.create(item)),
    );
  }

  async findAll(activeOnly = true) {
    const where = activeOnly ? { isActive: true } : {};
    return this.processStepRepository.find({
      where,
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const step = await this.processStepRepository.findOne({ where: { id } });
    if (!step) throw new NotFoundException('مرحله یافت نشد');
    return step;
  }

  async create(dto: CreateProcessStepDto) {
    const step = this.processStepRepository.create({
      ...dto,
      sort: dto.sort ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.processStepRepository.save(step);
  }

  async update(id: string, dto: UpdateProcessStepDto) {
    const step = await this.findOne(id);
    Object.assign(step, dto);
    return this.processStepRepository.save(step);
  }

  async remove(id: string) {
    const step = await this.findOne(id);
    await this.processStepRepository.remove(step);
    return { success: true };
  }
}
