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
import { BannerService } from './banner.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';

@Controller('banners')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('all') all?: string,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'banners', all);
    const data = await this.bannerService.findAll(!wantsAll(all));
    return {
      success: true,
      message: '',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.bannerService.findOne(id);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('banners', 'create')
  @Post()
  async create(@Body() dto: CreateBannerDto, @CurrentUser() actor: AdminUser) {
    const data = await this.bannerService.create(dto);
    await this.auditService.log({
      actor,
      module: 'banners',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد بنر «${data.title}»`,
    });
    return {
      success: true,
      message: 'بنر با موفقیت ایجاد شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('banners', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBannerDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.bannerService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'banners',
      action: 'update',
      entityId: id,
      summary: `ویرایش بنر «${data.title}»`,
    });
    return {
      success: true,
      message: 'بنر به‌روزرسانی شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('banners', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.bannerService.findOne(id);
    await this.bannerService.remove(id);
    await this.auditService.log({
      actor,
      module: 'banners',
      action: 'delete',
      entityId: id,
      summary: `حذف بنر «${existing.title}»`,
    });
    return {
      success: true,
      message: 'بنر حذف شد',
      data: null,
    };
  }
}
