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
import { CatalogService } from './catalog.service';
import {
  CreateCatalogItemDto,
  UpdateCatalogItemDto,
} from './dto/catalog-item.dto';

@Controller('catalog')
export class CatalogController {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('all') all?: string,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'catalog', all);
    const data = await this.catalogService.findAll(!wantsAll(all));
    return { success: true, message: '', data };
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.catalogService.findBySlug(slug);
    return { success: true, message: '', data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.catalogService.findOne(id);
    return { success: true, message: '', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('catalog', 'create')
  @Post()
  async create(
    @Body() dto: CreateCatalogItemDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.catalogService.create(dto);
    await this.auditService.log({
      actor,
      module: 'catalog',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد کاتالوگ «${data.title}»`,
    });
    return { success: true, message: 'آیتم کاتالوگ ایجاد شد', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('catalog', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCatalogItemDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.catalogService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'catalog',
      action: 'update',
      entityId: id,
      summary: `ویرایش کاتالوگ «${data.title}»`,
    });
    return { success: true, message: 'آیتم کاتالوگ به‌روزرسانی شد', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('catalog', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.catalogService.findOne(id);
    await this.catalogService.remove(id);
    await this.auditService.log({
      actor,
      module: 'catalog',
      action: 'delete',
      entityId: id,
      summary: `حذف کاتالوگ «${existing.title}»`,
    });
    return { success: true, message: 'آیتم کاتالوگ حذف شد', data: null };
  }
}
