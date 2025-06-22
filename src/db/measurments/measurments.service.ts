import {
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from '@/db/entities/measurement.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@/db/dto/pagination.dto';
import { UpdateMeasurementDto } from '@/db/dto/update-measurement.dto';
import { CreateMeasurementDto } from '@/db/dto/create-measurement.dto';
import { asString, generateCsv, mkConfig } from 'export-to-csv';
import { Variable } from '../entities/variable.entity';
import { handleDbExceptions } from '@/utils/handle-db-exceptions';

@Injectable()
export class MeasurementsService {
  private readonly logger = new Logger('MeasurementsService');

  constructor(
    @InjectRepository(Measurement)
    private readonly measurementsRepository: Repository<Measurement>,
    @InjectRepository(Variable)
    private readonly variablesRepository: Repository<Variable>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { offset, limit } = paginationDto;

    return await this.measurementsRepository.find({
      select: {
        variable: {
          nombre: true,
        },
        date: true,
        time: true,
        value: true,
        variable_id: true,
      },
      relations: { variable: true },
      take: limit,
      skip: offset,
    });
  }

  async findOne({
    variableId,
    date,
    time,
  }: {
    variableId: number;
    date: string;
    time: string;
  }) {
    const measurement = await this.measurementsRepository.findOneBy({
      variable_id: variableId,
      date,
      time,
    });

    if (!measurement)
      throw new NotFoundException(
        `Measurement with id: ${variableId}, date: ${date}, time: ${time} not found`,
      );
  }

  /**
   * Create new measurement
   */
  async create(createMeasurementDto: CreateMeasurementDto) {
    try {
      const measurement =
        this.measurementsRepository.create(createMeasurementDto);
      await this.measurementsRepository.save(measurement);
      return measurement;
    } catch (err) {
      handleDbExceptions(err);
    }
  }

  /**
   * Busca si existe una medición y si no existe la crea.
   */
  async update(variableId: number, updateMeasurementDto: UpdateMeasurementDto) {
    try {
      const { date, time } = updateMeasurementDto;

      let measurement = await this.measurementsRepository.findOneBy({
        variable_id: variableId,
        date,
        time,
      });

      if (measurement) return;

      measurement = this.measurementsRepository.create({
        variable_id: variableId,
        ...updateMeasurementDto,
      });

      return await this.measurementsRepository.save(measurement);
    } catch (err) {
      handleDbExceptions(err);
    }
  }

  async findMeasurementsByVariableId(
    variableId: number,
    paginationDto: PaginationDto,
  ) {
    const { limit, offset } = paginationDto;

    const [measurements] = await this.measurementsRepository.findAndCount({
      where: { variable_id: variableId },
      take: limit,
      skip: offset,
    });

    return measurements;
  }

  /**
   * Exporta las mediciones en formato CSV
   * @param paginationDto PaginationDto
   * @returns Promise<byte[]>
   */
  async exportToCsv(paginationDto: PaginationDto) {
    try {
      const measurements = await this.findAll(paginationDto);
      const csvConfig = mkConfig({ useKeysAsHeaders: true });
      const csvData = measurements.map(({ variable, date, ...m }) => ({
        ...m,
        date: date.toString(),
        variable_name: variable.nombre,
      }));
      const csv = generateCsv(csvConfig)(
        csvData as unknown as Record<string, any>[],
      );
      const csvInByteArr = new Uint8Array(Buffer.from(asString(csv), 'utf-8'));
      return new StreamableFile(csvInByteArr);
    } catch (err) {
      handleDbExceptions(err);
    }
  }

  /**
   * Obtiene la ultima telemetria de cada variable
   */
  async getLatests() {
    try {
      const query = `
    SELECT 
      v.id,
      v.nombre as name,
      m.date,
      m.time,
      m.value
    FROM variables v
    LEFT JOIN LATERAL (
      SELECT 
        m.date,
        m.time,
        m.value
      FROM measurements m
      WHERE m.variable_id = v.id
      ORDER BY m.date DESC, m.time DESC
      LIMIT 1
    ) m ON true
  `;

      return await this.variablesRepository.query(query);
    } catch (err) {
      handleDbExceptions(err);
    }
  }
}
