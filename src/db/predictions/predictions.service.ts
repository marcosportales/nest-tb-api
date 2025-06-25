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

  async create(createPredictionsDto: CreatePredictionDto[]) {
    try {
      const predictions = createPredictionsDto.map((dto) =>
        this.predictionsRepository.create({
          ...dto,
          date: dto.date.split('T')[0],
          // Por ahora se transforma a entero
          predicted_value: Math.trunc(dto.predicted_value),
        }),
      );

      await this.predictionsRepository.save(predictions);
      return predictions;
    } catch (err) {
      handleDbExceptions(err);
    }
  }
}
