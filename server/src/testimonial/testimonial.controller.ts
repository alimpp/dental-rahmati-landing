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
  CreateTestimonialDto,
  PublicSubmitTestimonialDto,
  UpdateTestimonialDto,
} from './dto/testimonial.dto';
import { TestimonialService } from './testimonial.service';

@Controller('testimonials')
export class TestimonialController {
  constructor(
    private readonly testimonialService: TestimonialService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('all') all?: string,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'testimonials', all);
    const data = await this.testimonialService.findAll(!wantsAll(all));
    return {
      success: true,
      message: '',
      data,
    };
  }

  /** Public review form — creates pending (inactive) testimonial */
  @Post('public')
  async submitPublic(@Body() dto: PublicSubmitTestimonialDto) {
    const data = await this.testimonialService.submitPublic(dto);
    return {
      success: true,
      message:
        'نظر شما ثبت شد. پس از تایید ادمین در سایت قابل بازدید خواهد بود.',
      data: { id: data.id },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.testimonialService.findOne(id);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('testimonials', 'create')
  @Post()
  async create(
    @Body() dto: CreateTestimonialDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.testimonialService.create(dto);
    await this.auditService.log({
      actor,
      module: 'testimonials',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد نظر بیمار «${data.clientName}»`,
    });
    return {
      success: true,
      message: 'نظر با موفقیت ایجاد شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('testimonials', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTestimonialDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.testimonialService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'testimonials',
      action: 'update',
      entityId: id,
      summary: `ویرایش نظر بیمار «${data.clientName}»`,
    });
    return {
      success: true,
      message: 'نظر به‌روزرسانی شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('testimonials', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.testimonialService.findOne(id);
    await this.testimonialService.remove(id);
    await this.auditService.log({
      actor,
      module: 'testimonials',
      action: 'delete',
      entityId: id,
      summary: `حذف نظر بیمار «${existing.clientName}»`,
    });
    return {
      success: true,
      message: 'نظر حذف شد',
      data: null,
    };
  }
}
