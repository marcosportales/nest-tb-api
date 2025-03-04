import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Medicion } from '@/db/entities/medicion.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@/db/dto/pagination.dto';
import { UpdateMedicionDto } from '@/db/dto/update-medicion.dto';
import { CreateMedicionDto } from '@/db/dto/create-medicion.dto';

@Injectable()
export class MedicionesService {
  private readonly logger = new Logger('MedicionService');

  constructor(
    @InjectRepository(Medicion)
    private readonly medicionesRepository: Repository<Medicion>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { offset = 0, limit = 10 } = paginationDto;
    return await this.medicionesRepository.find({
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
    const medicion = await this.medicionesRepository.findOneBy({
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
      const medicion = this.medicionesRepository.create(createMedicionDto);
      await this.medicionesRepository.save(medicion);
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

      let medicion = await this.medicionesRepository.findOneBy({
        variable_id: variableId,
        date,
        time,
      });

      if (medicion) return;

      medicion = this.medicionesRepository.create({
        variable_id: variableId,
        ...updateMedicionDto,
      });

      return await this.medicionesRepository.save(medicion);
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
