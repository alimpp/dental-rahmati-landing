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
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';
import { FaqService } from './faq.service';

@Controller('faqs')
export class FaqController {
  constructor(
    private readonly faqService: FaqService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('all') all?: string,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'faqs', all);
    const data = await this.faqService.findAll(!wantsAll(all));
    return {
      success: true,
      message: '',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.faqService.findOne(id);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('faqs', 'create')
  @Post()
  async create(@Body() dto: CreateFaqDto, @CurrentUser() actor: AdminUser) {
    const data = await this.faqService.create(dto);
    await this.auditService.log({
      actor,
      module: 'faqs',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد سوال متداول «${data.question}»`,
    });
    return {
      success: true,
      message: 'سوال با موفقیت ایجاد شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('faqs', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFaqDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.faqService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'faqs',
      action: 'update',
      entityId: id,
      summary: `ویرایش سوال متداول «${data.question}»`,
    });
    return {
      success: true,
      message: 'سوال به‌روزرسانی شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('faqs', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.faqService.findOne(id);
    await this.faqService.remove(id);
    await this.auditService.log({
      actor,
      module: 'faqs',
      action: 'delete',
      entityId: id,
      summary: `حذف سوال متداول «${existing.question}»`,
    });
    return {
      success: true,
      message: 'سوال حذف شد',
      data: null,
    };
  }
}
