import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessStep } from './entities/process-step.entity';
import { ProcessStepController } from './process-step.controller';
import { ProcessStepService } from './process-step.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessStep])],
  controllers: [ProcessStepController],
  providers: [ProcessStepService],
  exports: [ProcessStepService],
})
export class ProcessStepModule {}
