import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateVariableDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['analogic', 'digital'])
  signal_type?: string;

  @IsOptional()
  @IsString()
  @IsIn(['input', 'output'])
  io_type?: string;

  @IsOptional()
  @IsString()
  structure_name?: string;
}
