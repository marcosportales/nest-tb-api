import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from '@/db/entities/measurement.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@/db/dto/pagination.dto';
import { UpdateMeasurementDto } from '@/db/dto/update-measurement.dto';
import { CreateMeasurementDto } from '@/db/dto/create-measurement.dto';

@Injectable()
export class MeasurementsService {
  private readonly logger = new Logger('MeasurementsService');

  constructor(
    @InjectRepository(Measurement)
    private readonly measurementsRepository: Repository<Measurement>,
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
      this.handleDbExceptions(err);
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
      this.handleDbExceptions(err);
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

  private handleDbExceptions(err: any) {
    if (err.code === '23505') throw new BadRequestException(err.detail);
    this.logger.error(err.message);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
