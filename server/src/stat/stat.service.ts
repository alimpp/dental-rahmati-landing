import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatDto, UpdateStatDto } from './dto/stat.dto';
import { Stat } from './entities/stat.entity';
import { STAT_SEED } from './stat.seed';

@Injectable()
export class StatService implements OnModuleInit {
  constructor(
    @InjectRepository(Stat)
    private readonly statRepository: Repository<Stat>,
  ) {}

  async onModuleInit() {
    await this.seedIfEmpty();
  }

  private async seedIfEmpty() {
    const count = await this.statRepository.count();
    if (count > 0) return;

    await this.statRepository.save(
      STAT_SEED.map((item) => this.statRepository.create(item)),
    );
  }

  async findAll(activeOnly = true) {
    const where = activeOnly ? { isActive: true } : {};
    return this.statRepository.find({
      where,
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const stat = await this.statRepository.findOne({ where: { id } });
    if (!stat) throw new NotFoundException('آمار یافت نشد');
    return stat;
  }

  async create(dto: CreateStatDto) {
    const stat = this.statRepository.create({
      ...dto,
      sort: dto.sort ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.statRepository.save(stat);
  }

  async update(id: string, dto: UpdateStatDto) {
    const stat = await this.findOne(id);
    Object.assign(stat, dto);
    return this.statRepository.save(stat);
  }

  async remove(id: string) {
    const stat = await this.findOne(id);
    await this.statRepository.remove(stat);
    return { success: true };
  }
}
