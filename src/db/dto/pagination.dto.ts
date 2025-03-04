import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}
