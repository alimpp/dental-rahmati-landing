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
import { CreatePromiseDto, UpdatePromiseDto } from './dto/promise.dto';
import { PromiseService } from './promise.service';

@Controller('promises')
export class PromiseController {
  constructor(
    private readonly promiseService: PromiseService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('all') all?: string,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'promises', all);
    const data = await this.promiseService.findAll(!wantsAll(all));
    return {
      success: true,
      message: '',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.promiseService.findOne(id);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('promises', 'create')
  @Post()
  async create(@Body() dto: CreatePromiseDto, @CurrentUser() actor: AdminUser) {
    const data = await this.promiseService.create(dto);
    await this.auditService.log({
      actor,
      module: 'promises',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد تعهد «${data.title}»`,
    });
    return {
      success: true,
      message: 'تعهد با موفقیت ایجاد شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('promises', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePromiseDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.promiseService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'promises',
      action: 'update',
      entityId: id,
      summary: `ویرایش تعهد «${data.title}»`,
    });
    return {
      success: true,
      message: 'تعهد به‌روزرسانی شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('promises', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.promiseService.findOne(id);
    await this.promiseService.remove(id);
    await this.auditService.log({
      actor,
      module: 'promises',
      action: 'delete',
      entityId: id,
      summary: `حذف تعهد «${existing.title}»`,
    });
    return {
      success: true,
      message: 'تعهد حذف شد',
      data: null,
    };
  }
}
