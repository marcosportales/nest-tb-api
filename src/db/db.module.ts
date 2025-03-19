import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db.service';
import { VariablesService } from './variables/variables.service';
import { MedicionesService } from './measurments/measurments.service';
import { Measurement } from '@/db/entities/measurement.entity';
import { Variable } from '@/db/entities/variable.entity';
import { VariablesController } from '@/db/variables/variables.controller';
import { MedicionesController } from '@/db/measurments/measurments.controller';

@Module({
  controllers: [MedicionesController, VariablesController],
  imports: [TypeOrmModule.forFeature([Variable, Measurement])],
  providers: [DbService, VariablesService, MedicionesService],
  exports: [VariablesService, MedicionesService, DbService],
})
export class DbModule {}
