import { IsPositive, Min } from 'class-validator';
import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsPositive()
  @Optional()
  @Type(() => Number)
  limit?: number;

  @Min(0)
  @Optional()
  @Type(() => Number)
  offset?: number;
}
