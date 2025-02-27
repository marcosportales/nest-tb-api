import { Injectable } from '@nestjs/common';
import { ITelemetryData } from '@/dto/telemetry_data.dto';
import { MedicionService } from '@/db/medicion/medicion.service';
import { VariableService } from '@/db/variable/variable.service';
import { Medicion } from '@/entities/medicion.entity';

@Injectable()
export class DbService {
  constructor(
    private mediciones_service: MedicionService,
    private variables_service: VariableService,
  ) {}

  async processTelemetry(telemetry_data: ITelemetryData) {
    const { data } = telemetry_data;
    // get variables_id
    const vars_promise_array = Object.keys(data).map(async (item) => {
      return this.variables_service.getVariableByName(item);
    });
    // asumo por ahora que las variables existen
    const vars = await Promise.all(vars_promise_array);
    const non_exist_some_variables = vars.some((v) => !v);
    if (non_exist_some_variables) {
      // si no existe al menos una variable
      // debe crearse
    }
    const vars_info = vars.map(({ id, nombre }) => ({ id, nombre }));
    // insert new telemetry in db
    const mediciones = Object.keys(data).map((variable) => {
      const info_telemetry = data[variable].flat();
      const telemetry_datetime = new Date(info_telemetry[0]);

      const variable_id = vars_info.find((v) => variable === v.nombre).id;
      if (!variable_id) return;

      const new_medicion = new Medicion();
      new_medicion.variable_id = variable_id;
      new_medicion.value = info_telemetry[1];
      new_medicion.date = telemetry_datetime.toLocaleDateString();
      new_medicion.time = telemetry_datetime.toLocaleTimeString();
      return new_medicion;
    });

    return await this.mediciones_service.saveMedicion(mediciones);
  }
}
