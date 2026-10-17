import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromiseItem } from './entities/promise.entity';
import { PromiseController } from './promise.controller';
import { PromiseService } from './promise.service';

@Module({
  imports: [TypeOrmModule.forFeature([PromiseItem])],
  controllers: [PromiseController],
  providers: [PromiseService],
  exports: [PromiseService],
})
export class PromiseModule {}
