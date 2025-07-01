import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { ITelemetryData } from '@/ws/dto/telemetry_data.dto';
import { MeasurementsService } from '@/db/measurments/measurments.service';
import { VariablesService } from '@/db/variables/variables.service';
import { CreateVariableDto } from '@/db/dto/create-variable.dto';
import { UpdateMeasurementDto } from '@/db/dto/update-measurement.dto';
import { ConfigService } from '@nestjs/config';
import { handleDbExceptions } from '@/utils/handle-db-exceptions';

@Injectable()
export class DbService {
  private readonly logger = new Logger('DbService');

  constructor(
    private readonly measurementsService: MeasurementsService,
    private readonly variablesService: VariablesService,
    private readonly configService: ConfigService,
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

    const measurementPromises = Object.entries(data).map(
      ([variable, values]) => {
        const [timestamp, value] = values.flat();
        const telemetryDatetime = new Date(timestamp);
        const date = telemetryDatetime.toISOString().split('T')[0];
        const time = telemetryDatetime.toTimeString().split(' ')[0];

        return this.measurementsService.update(variablesMap.get(variable), {
          value,
          date,
          time,
        } as UpdateMeasurementDto);
      },
    );

    await Promise.all(measurementPromises);
  }

  async sendTelemetryToModel(telemetryData: ITelemetryData) {
    try {
      const MODEL_API_URL = this.configService.get<string>('MODEL_API_URL');
      if (!MODEL_API_URL) {
        this.logger.log('MODEL_API_URL is not defined in the environment.');
        return;
      }

      const { data } = telemetryData;
      if (!Object.keys(data).length) return;
      this.logger.log('Sending telemetry to ai model for prediction...');

      axios
        .post(`${MODEL_API_URL}/validation`, { data })
        .then(() => {
          this.logger.log('Telemetry successfully sent to ai model.');
        })
        .catch((err) => {
          this.logger.error(
            `Something went wrong sending telemetry to ai model. (${err})`,
          );
        });
    } catch (err) {
      this.logger.error(err);
      handleDbExceptions(err);
    }
  }
}
