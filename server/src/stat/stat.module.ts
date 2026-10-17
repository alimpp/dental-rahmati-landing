import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stat } from './entities/stat.entity';
import { StatController } from './stat.controller';
import { StatService } from './stat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stat])],
  controllers: [StatController],
  providers: [StatService],
  exports: [StatService],
})
export class StatModule {}
