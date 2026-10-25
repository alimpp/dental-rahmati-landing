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
  CreatePortfolioItemDto,
  UpdatePortfolioItemDto,
} from './dto/portfolio-item.dto';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('all') all?: string,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'portfolio', all);
    const data = await this.portfolioService.findAll(!wantsAll(all));
    return { success: true, message: '', data };
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.portfolioService.findBySlug(slug);
    return { success: true, message: '', data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.portfolioService.findOne(id);
    return { success: true, message: '', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('portfolio', 'create')
  @Post()
  async create(
    @Body() dto: CreatePortfolioItemDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.portfolioService.create(dto);
    await this.auditService.log({
      actor,
      module: 'portfolio',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد نمونه کار «${data.title}»`,
    });
    return { success: true, message: 'نمونه کار ایجاد شد', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('portfolio', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePortfolioItemDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.portfolioService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'portfolio',
      action: 'update',
      entityId: id,
      summary: `ویرایش نمونه کار «${data.title}»`,
    });
    return { success: true, message: 'نمونه کار به‌روزرسانی شد', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('portfolio', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.portfolioService.findOne(id);
    await this.portfolioService.remove(id);
    await this.auditService.log({
      actor,
      module: 'portfolio',
      action: 'delete',
      entityId: id,
      summary: `حذف نمونه کار «${existing.title}»`,
    });
    return { success: true, message: 'نمونه کار حذف شد', data: null };
  }
}
