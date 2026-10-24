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
import { CreateThemeDto, UpdateThemeDto } from './dto/theme.dto';
import { ThemeService } from './theme.service';

@Controller('themes')
export class ThemeController {
  constructor(
    private readonly themeService: ThemeService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('all') all?: string,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'themes', all);
    const data = await this.themeService.findAll({ all: wantsAll(all) });
    return { success: true, message: '', data };
  }

  @Get('default')
  async findDefault() {
    const data = await this.themeService.findDefault();
    return { success: true, message: '', data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.themeService.findOne(id);
    return { success: true, message: '', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('themes', 'create')
  @Post()
  async create(@Body() dto: CreateThemeDto, @CurrentUser() actor: AdminUser) {
    const data = await this.themeService.create(dto);
    await this.auditService.log({
      actor,
      module: 'themes',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد تم «${data.name}»`,
    });
    return { success: true, message: 'تم با موفقیت ایجاد شد', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('themes', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateThemeDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.themeService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'themes',
      action: 'update',
      entityId: id,
      summary: `ویرایش تم «${data.name}»`,
    });
    return { success: true, message: 'تم به‌روزرسانی شد', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('themes', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.themeService.findOne(id);
    await this.themeService.remove(id);
    await this.auditService.log({
      actor,
      module: 'themes',
      action: 'delete',
      entityId: id,
      summary: `حذف تم «${existing.name}»`,
    });
    return { success: true, message: 'تم حذف شد', data: null };
  }
}
