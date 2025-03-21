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
import { UpdateMedicionDto } from '@/db/dto/update-measurement.dto';
import { CreateMedicionDto } from '@/db/dto/create-measurement.dto';

@Injectable()
export class MeasurementsService {
  private readonly logger = new Logger('MedicionService');

  constructor(
    @InjectRepository(Measurement)
    private readonly measurementsRepository: Repository<Measurement>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { offset = 0, limit = 10 } = paginationDto;
    return await this.measurementsRepository.find({
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
    const medicion = await this.measurementsRepository.findOneBy({
      variable_id: variableId,
      date,
      time,
    });

    if (!medicion)
      throw new NotFoundException(
        `Medicion with id: ${variableId}, date: ${date}, time: ${time} not found`,
      );
  }

  async create(createMedicionDto: CreateMedicionDto) {
    try {
      const medicion = this.measurementsRepository.create(createMedicionDto);
      await this.measurementsRepository.save(medicion);
      return medicion;
    } catch (err) {
      this.handleDbExceptions(err);
    }
  }

  /**
   * Busca si existe una medición y si no existe la crea.
   */
  async update(variableId: number, updateMedicionDto: UpdateMedicionDto) {
    try {
      const { date, time } = updateMedicionDto;

      let medicion = await this.measurementsRepository.findOneBy({
        variable_id: variableId,
        date,
        time,
      });

      if (medicion) return;

      medicion = this.measurementsRepository.create({
        variable_id: variableId,
        ...updateMedicionDto,
      });

      return await this.measurementsRepository.save(medicion);
    } catch (err) {
      this.handleDbExceptions(err);
    }
  }

  private handleDbExceptions(err: any) {
    if (err.code === '23505') throw new BadRequestException(err.detail);
    this.logger.error(err.message);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
