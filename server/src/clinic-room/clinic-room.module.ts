import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicRoomController } from './clinic-room.controller';
import { ClinicRoomService } from './clinic-room.service';
import { ClinicRoom } from './entities/clinic-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicRoom])],
  controllers: [ClinicRoomController],
  providers: [ClinicRoomService],
  exports: [ClinicRoomService],
})
export class ClinicRoomModule {}
