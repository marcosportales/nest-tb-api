import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreatePredictionDto {
  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  name: string;

  @IsNumber()
  predicted_value: number;
}
