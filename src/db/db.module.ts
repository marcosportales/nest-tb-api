import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db.service';
import { VariablesService } from '@/db/variables/variables.service';
import { MeasurementsService } from '@/db/measurments/measurments.service';
import { Measurement } from '@/db/entities/measurement.entity';
import { Variable } from '@/db/entities/variable.entity';
import { VariablesController } from '@/db/variables/variables.controller';
import { MeasurementsController } from '@/db/measurments/measurments.controller';

@Module({
  controllers: [MeasurementsController, VariablesController],
  imports: [TypeOrmModule.forFeature([Variable, Measurement])],
  providers: [DbService, VariablesService, MeasurementsService],
  exports: [VariablesService, MeasurementsService, DbService],
})
export class DbModule {}
