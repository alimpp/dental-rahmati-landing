import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from '../auth/audit.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import type { AdminUser } from '../auth/entities/admin-user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { assertCanListAll, wantsAll } from '../auth/list-all.util';
import { CreateStatDto, UpdateStatDto } from './dto/stat.dto';
import { StatService } from './stat.service';

@Controller('stats')
export class StatController {
  constructor(
    private readonly statService: StatService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('all') all?: string,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'stats', all);
    const data = await this.statService.findAll(!wantsAll(all));
    return {
      success: true,
      message: '',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.statService.findOne(id);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('stats', 'create')
  @Post()
  async create(@Body() dto: CreateStatDto, @CurrentUser() actor: AdminUser) {
    const data = await this.statService.create(dto);
    await this.auditService.log({
      actor,
      module: 'stats',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد آمار «${data.label}»`,
    });
    return {
      success: true,
      message: 'آمار با موفقیت ایجاد شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('stats', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.statService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'stats',
      action: 'update',
      entityId: id,
      summary: `ویرایش آمار «${data.label}»`,
    });
    return {
      success: true,
      message: 'آمار به‌روزرسانی شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('stats', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.statService.findOne(id);
    await this.statService.remove(id);
    await this.auditService.log({
      actor,
      module: 'stats',
      action: 'delete',
      entityId: id,
      summary: `حذف آمار «${existing.label}»`,
    });
    return {
      success: true,
      message: 'آمار حذف شد',
      data: null,
    };
  }
}
