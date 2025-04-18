import { PartialType } from '@nestjs/mapped-types';
import { CreateMeasurementDto } from '@/db/dto/create-measurement.dto';

export class UpdateMeasurementDto extends PartialType(CreateMeasurementDto) {}
