import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateMedicionDto {
  @IsNumber()
  @IsPositive()
  variable_id: number;

  @IsNotEmpty()
  value: any;

  @IsDate()
  date: string;

  @IsString()
  time: string;
}
