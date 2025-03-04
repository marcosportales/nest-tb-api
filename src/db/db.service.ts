import { Injectable, Logger } from '@nestjs/common';
import { ITelemetryData } from '@/ws/dto/telemetry_data.dto';
import { MedicionesService } from '@/db/mediciones/mediciones.service';
import { VariablesService } from '@/db/variables/variables.service';
import { CreateVariableDto } from '@/db/dto/create-variable.dto';
import { UpdateMedicionDto } from '@/db/dto/update-medicion.dto';

@Injectable()
export class DbService {
  private readonly logger = new Logger('DbService');

  constructor(
    private readonly medicionesService: MedicionesService,
    private readonly variablesService: VariablesService,
  ) {}

  async processTelemetry(telemetryData: ITelemetryData) {
    const { data } = telemetryData;
    if (!Object.keys(data).length) return;

    const variablesMap = new Map<string, number>();
    await Promise.all(
      Object.keys(data).map(async (nombre) => {
        let variable = await this.variablesService.findOneByName(nombre, false);
        if (!variable.id) {
          this.logger.log(`Variable not found: ${nombre}`);
          variable = await this.variablesService.create({
            nombre,
          } as CreateVariableDto);
        }
        variablesMap.set(nombre, variable.id);
      }),
    );

    const medicionPromises = Object.entries(data).map(([variable, values]) => {
      const [timestamp, value] = values.flat();
      const telemetryDatetime = new Date(timestamp);
      const date = telemetryDatetime.toISOString().split('T')[0];
      const time = telemetryDatetime.toTimeString().split(' ')[0];

      return this.medicionesService.update(variablesMap.get(variable), {
        value,
        date,
        time,
      } as UpdateMedicionDto);
    });

    await Promise.all(medicionPromises);
  }
}
