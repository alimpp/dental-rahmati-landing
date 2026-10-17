import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentBooking } from './entities/appointment-booking.entity';
import { AppointmentSlot } from './entities/appointment-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentSlot, AppointmentBooking])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
