import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePromiseDto, UpdatePromiseDto } from './dto/promise.dto';
import { PromiseItem } from './entities/promise.entity';
import { PROMISE_SEED } from './promise.seed';

@Injectable()
export class PromiseService implements OnModuleInit {
  constructor(
    @InjectRepository(PromiseItem)
    private readonly promiseRepository: Repository<PromiseItem>,
  ) {}

  async onModuleInit() {
    await this.seedIfEmpty();
  }

  private async seedIfEmpty() {
    const count = await this.promiseRepository.count();
    if (count > 0) return;

    await this.promiseRepository.save(
      PROMISE_SEED.map((item) => this.promiseRepository.create(item)),
    );
  }

  async findAll(activeOnly = true) {
    const where = activeOnly ? { isActive: true } : {};
    return this.promiseRepository.find({
      where,
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const item = await this.promiseRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('تعهد یافت نشد');
    return item;
  }

  async create(dto: CreatePromiseDto) {
    const item = this.promiseRepository.create({
      ...dto,
      sort: dto.sort ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.promiseRepository.save(item);
  }

  async update(id: string, dto: UpdatePromiseDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.promiseRepository.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.promiseRepository.remove(item);
    return { success: true };
  }
}
