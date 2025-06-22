import { CreatePredictionDto } from '@/db/dto/create-prediction.dto';
import { Prediction } from '@/db/entities/prediction.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PredictionsService {
  private readonly logger = new Logger('PredictionsService');

  constructor(
    @InjectRepository(Prediction)
    private readonly predictionsRepository: Repository<Prediction>,
  ) {}

  async create(createPredictionDto: CreatePredictionDto) {
    try {
      const prediction = this.predictionsRepository.create(createPredictionDto);
      await this.predictionsRepository.save(prediction);
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
