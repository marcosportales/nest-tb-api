import { CreatePredictionDto } from '@/db/dto/create-prediction.dto';
import { Prediction } from '@/db/entities/prediction.entity';
import { handleDbExceptions } from '@/utils/handle-db-exceptions';
import { Injectable, Logger } from '@nestjs/common';
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
      handleDbExceptions(err);
    }
  }
}
