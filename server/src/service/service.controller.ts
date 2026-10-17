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
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { ServiceService } from './service.service';

@Controller('services')
export class ServiceController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('all') all?: string,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'services', all);
    const data = await this.serviceService.findAll(!wantsAll(all));
    return {
      success: true,
      message: '',
      data,
    };
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.serviceService.findBySlug(slug);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.serviceService.findOne(id);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('services', 'create')
  @Post()
  async create(@Body() dto: CreateServiceDto, @CurrentUser() actor: AdminUser) {
    const data = await this.serviceService.create(dto);
    await this.auditService.log({
      actor,
      module: 'services',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد خدمت «${data.title}»`,
    });
    return {
      success: true,
      message: 'خدمت با موفقیت ایجاد شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('services', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.serviceService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'services',
      action: 'update',
      entityId: id,
      summary: `ویرایش خدمت «${data.title}»`,
    });
    return {
      success: true,
      message: 'خدمت به‌روزرسانی شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('services', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.serviceService.findOne(id);
    await this.serviceService.remove(id);
    await this.auditService.log({
      actor,
      module: 'services',
      action: 'delete',
      entityId: id,
      summary: `حذف خدمت «${existing.title}»`,
    });
    return {
      success: true,
      message: 'خدمت حذف شد',
      data: null,
    };
  }
}
