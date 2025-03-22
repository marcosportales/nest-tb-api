import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Variable } from '@/db/entities/variable.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@/db/dto/pagination.dto';
import { CreateVariableDto } from '@/db/dto/create-variable.dto';
import { UpdateVariableDto } from '@/db/dto/update-variable.dto';
import { MeasurementsService } from '@/db/measurments/measurments.service';

@Injectable()
export class VariablesService {
  private readonly logger = new Logger('VariablesService');

  constructor(
    @InjectRepository(Variable)
    private readonly variablesRepository: Repository<Variable>,
    @Inject(forwardRef(() => MeasurementsService))
    private readonly measurementsService: MeasurementsService,
  ) {}

  async findAll(queryParams: PaginationDto): Promise<Variable[]> {
    const { offset = 0, limit = 10 } = queryParams;
    return await this.variablesRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number): Promise<Variable> {
    const variable = await this.variablesRepository.findOneBy({ id });

    if (!variable)
      throw new NotFoundException(`Variable with id: ${id} not found`);

    return variable;
  }
  /**
   * Si no se encuentra la variable y no es externa, se devuelve el nombre de la variable
    para saber en el metodo processTelemetry de DbService que no se encontro la variable
    sino se lanza una excepcion (e.g si se llama desde el controlador)
  **/
  async findOneByName(nombre: string, external = true) {
    const variable = await this.variablesRepository.findOneBy({ nombre });
    if (!variable) {
      if (!external) return { nombre } as Variable;
      throw new NotFoundException(`Variable with name: ${nombre} not found`);
    }
    return variable;
  }

  async create(createVariableDto: CreateVariableDto) {
    try {
      const variable = this.variablesRepository.create(createVariableDto);
      await this.variablesRepository.save(variable);
      return variable;
    } catch (err) {
      this.handleDbExceptions(err);
    }
  }

  async update(id: number, updateVariableDto: UpdateVariableDto) {
    const variable = await this.variablesRepository.preload({
      id,
      ...updateVariableDto,
    });

    if (!variable)
      throw new NotFoundException(`Variable with id: ${id} not found`);

    try {
      await this.variablesRepository.save(variable);
      return variable;
    } catch (err) {
      this.handleDbExceptions(err);
    }
  }

  /**
   * Devuelve la telemetria de una variable
   **/
  async findMeasurementsByVariableId(id: number, paginationDto: PaginationDto) {
    const variable = await this.variablesRepository.findOneBy({ id });

    if (!variable) {
      throw new NotFoundException(`Variable with id: ${id} not found`);
    }

    const measurements =
      await this.measurementsService.findMeasurementsByVariableId(
        id,
        paginationDto,
      );

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
