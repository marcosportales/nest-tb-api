import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicionDto } from '@/db/dto/create-measurement.dto';

export class UpdateMeasurementDto extends PartialType(CreateMedicionDto) {}
