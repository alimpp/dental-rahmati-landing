import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { RequirePermission } from './decorators/require-permission.decorator';
import { HistoryQueryDto } from './dto/history-query.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Controller('history')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class HistoryController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermission('history', 'view')
  async findAll(@Query() query: HistoryQueryDto) {
    const data = await this.auditService.findPaged(query);
    return { success: true, message: '', data };
  }
}
