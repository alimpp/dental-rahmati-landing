import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { Service } from './entities/service.entity';
import { SERVICE_SEED } from './service.seed';

@Injectable()
export class ServiceService implements OnModuleInit {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async onModuleInit() {
    await this.seedMissingOnly();
  }

  /** Insert missing seed rows only — never overwrite admin edits. */
  private async seedMissingOnly() {
    for (const item of SERVICE_SEED) {
      const existing = await this.serviceRepository.findOne({
        where: { slug: item.slug },
      });
      if (existing) continue;
      await this.serviceRepository.save(this.serviceRepository.create(item));
    }
  }

  async findAll(activeOnly = true) {
    const where = activeOnly ? { isActive: true } : {};
    const items = await this.serviceRepository.find({
      where,
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
    // Public list/card payloads omit heavy bodies; admin (?all) keeps full rows.
    if (!activeOnly) return items;
    return items.map((item) => ({
      ...item,
      sections: null,
      casePathDescription: null,
      requiredDocuments: null,
    }));
  }

  async findOne(id: string) {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) throw new NotFoundException('خدمت یافت نشد');
    return service;
  }

  async findBySlug(slug: string) {
    const service = await this.serviceRepository.findOne({ where: { slug } });
    if (!service) throw new NotFoundException('خدمت یافت نشد');
    return service;
  }

  async create(dto: CreateServiceDto) {
    const service = this.serviceRepository.create({
      ...dto,
      sort: dto.sort ?? 0,
      isActive: dto.isActive ?? true,
      sections: dto.sections ?? null,
      requiredDocuments: dto.requiredDocuments ?? null,
    });
    return this.serviceRepository.save(service);
  }

  async update(id: string, dto: UpdateServiceDto) {
    const service = await this.findOne(id);
    Object.assign(service, dto);
    return this.serviceRepository.save(service);
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
    return { success: true };
  }
}
