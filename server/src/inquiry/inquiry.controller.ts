import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from '../auth/audit.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import type { AdminUser } from '../auth/entities/admin-user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { CreateInquiryInput } from './inquiry.schema';
import { createInquirySchema } from './inquiry.schema';
import { InquiryService } from './inquiry.service';
import { ZodValidationPipe } from './zod-validation.pipe';

@Controller('inquiries')
export class InquiryController {
  constructor(
    private readonly inquiryService: InquiryService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createInquirySchema)) dto: CreateInquiryInput,
  ) {
    const data = await this.inquiryService.create(dto);
    return {
      success: true,
      message: 'درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('inquiries', 'view')
  @Get()
  async findAll() {
    const data = await this.inquiryService.findAll();
    return {
      success: true,
      message: '',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('inquiries', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.inquiryService.findOne(id);
    await this.inquiryService.remove(id);
    await this.auditService.log({
      actor,
      module: 'inquiries',
      action: 'delete',
      entityId: id,
      summary: `حذف درخواست «${existing.name}»`,
    });
    return {
      success: true,
      message: 'درخواست حذف شد',
      data: null,
    };
  }
}
