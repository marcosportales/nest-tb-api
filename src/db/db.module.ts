import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db.service';
import { VariableService } from './variable/variable.service';
import { MedicionService } from './medicion/medicion.service';
import { Medicion } from '@/db/entities/medicion.entity';
import { Variable } from '@/db/entities/variable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variable, Medicion])],
  providers: [DbService, VariableService, MedicionService],
  exports: [VariableService, MedicionService, DbService],
})
export class DbModule {}
