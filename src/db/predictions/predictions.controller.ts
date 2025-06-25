import { CreatePredictionDto } from '@/db/dto/create-prediction.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { PredictionsService } from './predictions.service';

@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Post('')
  async create(
    @Body('predictions') createPredictionsDto: CreatePredictionDto[],
  ) {
    return this.predictionsService.create(createPredictionsDto);
  }
}
