import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { AuditService } from './audit.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { RequirePermission } from './decorators/require-permission.decorator';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin-user.dto';
import type { AdminUser } from './entities/admin-user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Controller('admins')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminUsersController {
  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @RequirePermission('admins', 'view')
  async findAll() {
    const data = await this.adminUsersService.findAll();
    return { success: true, message: '', data };
  }

  @Post()
  @RequirePermission('admins', 'create')
  async create(@Body() dto: CreateAdminDto, @CurrentUser() actor: AdminUser) {
    const data = await this.adminUsersService.create(dto, actor.isSuperAdmin);
    await this.auditService.log({
      actor,
      module: 'admins',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد ادمین «${data.username}»`,
    });
    return { success: true, message: 'ادمین ایجاد شد', data };
  }

  @Patch(':id')
  @RequirePermission('admins', 'edit')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.adminUsersService.update(id, dto, actor.isSuperAdmin);
    await this.auditService.log({
      actor,
      module: 'admins',
      action: 'update',
      entityId: id,
      summary: `ویرایش ادمین «${data.username}»`,
    });
    return { success: true, message: 'ادمین به‌روزرسانی شد', data };
  }

  @Delete(':id')
  @RequirePermission('admins', 'delete')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    await this.adminUsersService.remove(id, actor.isSuperAdmin);
    await this.auditService.log({
      actor,
      module: 'admins',
      action: 'delete',
      entityId: id,
      summary: 'حذف ادمین',
    });
    return { success: true, message: 'ادمین حذف شد', data: null };
  }
}
