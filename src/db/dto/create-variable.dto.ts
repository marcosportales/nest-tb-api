import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateVariableDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  signal_type?: string;

  @IsOptional()
  @IsString()
  @IsIn(['I', 'O'])
  io_type?: string;

  @IsOptional()
  @IsString()
  structure_name?: string;
}
