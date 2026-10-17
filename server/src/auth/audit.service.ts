import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { HistoryQueryDto } from './dto/history-query.dto';
import { AuditLog } from './entities/audit-log.entity';
import type { AdminUser } from './entities/admin-user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async log(input: {
    actor?: AdminUser | null;
    module: string;
    action: string;
    entityId?: string | null;
    summary: string;
    payload?: unknown;
  }) {
    const row = this.auditRepository.create({
      actorId: input.actor?.id ?? null,
      actorUsername: input.actor?.username ?? 'سیستم',
      module: input.module,
      action: input.action,
      entityId: input.entityId ?? null,
      summary: input.summary,
      payload:
        input.payload && typeof input.payload === 'object'
          ? (input.payload as Record<string, unknown>)
          : null,
    });
    await this.auditRepository.save(row);
  }

  async findPaged(query: HistoryQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = query.module ? { module: query.module } : {};
    const [items, total] = await this.auditRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      items,
      total,
      page,
      limit,
      pageCount: Math.max(1, Math.ceil(total / limit)),
    };
  }
}
