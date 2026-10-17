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
import { CreateGuideDto, UpdateGuideDto } from './dto/guide.dto';
import { GuideService } from './guide.service';

@Controller('guides')
export class GuideController {
  constructor(
    private readonly guideService: GuideService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('all') all?: string,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'guides', all);
    const data = await this.guideService.findAll(!wantsAll(all));
    return { success: true, message: '', data };
  }

  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.guideService.findBySlug(slug);
    return { success: true, message: '', data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.guideService.findOne(id);
    return { success: true, message: '', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('guides', 'create')
  @Post()
  async create(@Body() dto: CreateGuideDto, @CurrentUser() actor: AdminUser) {
    const data = await this.guideService.create(dto);
    await this.auditService.log({
      actor,
      module: 'guides',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد راهنما «${data.title}»`,
    });
    return { success: true, message: 'راهنما ایجاد شد', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('guides', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGuideDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.guideService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'guides',
      action: 'edit',
      entityId: id,
      summary: `ویرایش راهنما «${data.title}»`,
    });
    return { success: true, message: 'راهنما به‌روزرسانی شد', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('guides', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.guideService.findOne(id);
    await this.guideService.remove(id);
    await this.auditService.log({
      actor,
      module: 'guides',
      action: 'delete',
      entityId: id,
      summary: `حذف راهنما «${existing.title}»`,
    });
    return { success: true, message: 'راهنما حذف شد', data: null };
  }
}
