import { IsNumber } from 'class-validator';

export class CreatePredictionDto {
  @IsNumber()
  intern_temperature: number;

  @IsNumber()
  input_temperature: number;

  @IsNumber()
  output_temperature: number;

  @IsNumber()
  chimney_temperature: number;

  @IsNumber()
  fan_speed: number;

  @IsNumber()
  predicted_value: number;
}
