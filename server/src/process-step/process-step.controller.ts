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
import {
  CreateProcessStepDto,
  UpdateProcessStepDto,
} from './dto/process-step.dto';
import { ProcessStepService } from './process-step.service';

@Controller('process-steps')
export class ProcessStepController {
  constructor(
    private readonly processStepService: ProcessStepService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('all') all?: string,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'process_steps', all);
    const data = await this.processStepService.findAll(!wantsAll(all));
    return {
      success: true,
      message: '',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.processStepService.findOne(id);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('process_steps', 'create')
  @Post()
  async create(
    @Body() dto: CreateProcessStepDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.processStepService.create(dto);
    await this.auditService.log({
      actor,
      module: 'process_steps',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد مرحله مسیر پرونده «${data.title}»`,
    });
    return {
      success: true,
      message: 'مرحله با موفقیت ایجاد شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('process_steps', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProcessStepDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.processStepService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'process_steps',
      action: 'update',
      entityId: id,
      summary: `ویرایش مرحله مسیر پرونده «${data.title}»`,
    });
    return {
      success: true,
      message: 'مرحله به‌روزرسانی شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('process_steps', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.processStepService.findOne(id);
    await this.processStepService.remove(id);
    await this.auditService.log({
      actor,
      module: 'process_steps',
      action: 'delete',
      entityId: id,
      summary: `حذف مرحله مسیر پرونده «${existing.title}»`,
    });
    return {
      success: true,
      message: 'مرحله حذف شد',
      data: null,
    };
  }
}
