import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db.service';
import { VariablesService } from '@/db/variables/variables.service';
import { MeasurementsService } from '@/db/measurments/measurments.service';
import { Measurement } from '@/db/entities/measurement.entity';
import { Variable } from '@/db/entities/variable.entity';
import { VariablesController } from '@/db/variables/variables.controller';
import { MeasurementsController } from '@/db/measurments/measurments.controller';
import { PredictionsController } from '@/db/predictions/predictions.controller';
import { Prediction } from '@/db/entities/prediction.entity';
import { PredictionsService } from '@/db/predictions/predictions.service';

@Module({
  controllers: [
    MeasurementsController,
    VariablesController,
    PredictionsController,
  ],
  imports: [TypeOrmModule.forFeature([Variable, Measurement, Prediction])],
  providers: [
    DbService,
    VariablesService,
    MeasurementsService,
    PredictionsService,
  ],
  exports: [VariablesService, MeasurementsService, DbService],
})
export class DbModule {}
