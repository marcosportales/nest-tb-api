import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db.service';
import { VariablesService } from './variables/variables.service';
import { MedicionesService } from './mediciones/mediciones.service';
import { Medicion } from '@/db/entities/medicion.entity';
import { Variable } from '@/db/entities/variable.entity';
import { VariablesController } from '@/db/variables/variables.controller';
import { MedicionesController } from '@/db/mediciones/mediciones.controller';

@Module({
  controllers: [MedicionesController, VariablesController],
  imports: [TypeOrmModule.forFeature([Variable, Medicion])],
  providers: [DbService, VariablesService, MedicionesService],
  exports: [VariablesService, MedicionesService, DbService],
})
export class DbModule {}
