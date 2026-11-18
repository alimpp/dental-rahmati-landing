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
import { ClinicRoomService } from './clinic-room.service';
import {
  CreateClinicRoomDto,
  UpdateClinicRoomDto,
} from './dto/clinic-room.dto';

@Controller('clinic-rooms')
export class ClinicRoomController {
  constructor(
    private readonly clinicRoomService: ClinicRoomService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('all') all?: string,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'clinic', all);
    const data = await this.clinicRoomService.findAll(!wantsAll(all));
    return {
      success: true,
      message: '',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.clinicRoomService.findOne(id);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('clinic', 'create')
  @Post()
  async create(
    @Body() dto: CreateClinicRoomDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.clinicRoomService.create(dto);
    await this.auditService.log({
      actor,
      module: 'clinic',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد فضای کلینیک «${data.title}»`,
    });
    return {
      success: true,
      message: 'فضای کلینیک با موفقیت ایجاد شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('clinic', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClinicRoomDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.clinicRoomService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'clinic',
      action: 'update',
      entityId: id,
      summary: `ویرایش فضای کلینیک «${data.title}»`,
    });
    return {
      success: true,
      message: 'فضای کلینیک به‌روزرسانی شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('clinic', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.clinicRoomService.findOne(id);
    await this.clinicRoomService.remove(id);
    await this.auditService.log({
      actor,
      module: 'clinic',
      action: 'delete',
      entityId: id,
      summary: `حذف فضای کلینیک «${existing.title}»`,
    });
    return {
      success: true,
      message: 'فضای کلینیک حذف شد',
      data: null,
    };
  }
}
