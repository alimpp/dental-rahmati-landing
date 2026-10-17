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
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { ZodValidationPipe } from '../inquiry/zod-validation.pipe';
import { AppointmentService } from './appointment.service';
import {
  createBookingSchema,
  type CreateBookingInput,
} from './appointment.schema';
import {
  BulkCreateSlotsDto,
  CreateSlotDto,
  UpdateSlotDto,
} from './dto/appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly auditService: AuditService,
  ) {}

  // ─── Public ───────────────────────────────────────────────

  @Get('available')
  async available(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const data = await this.appointmentService.findAvailableSlots(from, to);
    return { success: true, message: '', data };
  }

  @Get('available-dates')
  async availableDates(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const data = await this.appointmentService.findAvailableDates(from, to);
    return { success: true, message: '', data };
  }

  @Post('book')
  async book(
    @Body(new ZodValidationPipe(createBookingSchema)) dto: CreateBookingInput,
  ) {
    const data = await this.appointmentService.book(dto);
    return {
      success: true,
      message: 'نوبت شما با موفقیت رزرو شد.',
      data,
    };
  }

  // ─── Admin: slots ─────────────────────────────────────────

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('appointment_slots', 'view')
  @Get('slots')
  async adminSlots(@Query('date') date?: string) {
    const data = await this.appointmentService.findAllSlotsAdmin(date);
    return { success: true, message: '', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('appointment_slots', 'create')
  @Post('slots')
  async createSlot(
    @Body() dto: CreateSlotDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.appointmentService.createSlot(dto);
    await this.auditService.log({
      actor,
      module: 'appointment_slots',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد نوبت ${data.date} ${data.startTime}-${data.endTime}`,
    });
    return { success: true, message: 'نوبت خالی ثبت شد', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('appointment_slots', 'create')
  @Post('slots/bulk')
  async createSlotsBulk(
    @Body() dto: BulkCreateSlotsDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.appointmentService.createSlotsBulk(dto);
    await this.auditService.log({
      actor,
      module: 'appointment_slots',
      action: 'create',
      entityId: null,
      summary: `ثبت ${data.length} نوبت برای تاریخ ${dto.date}`,
    });
    return {
      success: true,
      message: `${data.length} نوبت ثبت شد`,
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('appointment_slots', 'edit')
  @Patch('slots/:id')
  async updateSlot(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSlotDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.appointmentService.updateSlot(id, dto);
    await this.auditService.log({
      actor,
      module: 'appointment_slots',
      action: 'edit',
      entityId: id,
      summary: `ویرایش نوبت ${data.date} ${data.startTime}-${data.endTime}`,
    });
    return { success: true, message: 'نوبت به‌روزرسانی شد', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('appointment_slots', 'delete')
  @Delete('slots/:id')
  async removeSlot(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.appointmentService.findSlotEntity(id);
    await this.appointmentService.removeSlot(id);
    await this.auditService.log({
      actor,
      module: 'appointment_slots',
      action: 'delete',
      entityId: id,
      summary: `حذف نوبت ${existing.date} ${existing.startTime}-${existing.endTime}`,
    });
    return { success: true, message: 'نوبت حذف شد', data: null };
  }

  // ─── Admin: bookings ──────────────────────────────────────

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('appointment_bookings', 'view')
  @Get('bookings')
  async adminBookings() {
    const data = await this.appointmentService.findAllBookings();
    return { success: true, message: '', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('appointment_bookings', 'delete')
  @Delete('bookings/:id')
  async removeBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.appointmentService.findBooking(id);
    await this.appointmentService.removeBooking(id);
    await this.auditService.log({
      actor,
      module: 'appointment_bookings',
      action: 'delete',
      entityId: id,
      summary: `لغو رزرو «${existing.firstName} ${existing.lastName}»`,
    });
    return {
      success: true,
      message: 'رزرو لغو شد و نوبت دوباره آزاد است',
      data: null,
    };
  }
}
