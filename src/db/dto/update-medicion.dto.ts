import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicionDto } from '@/db/dto/create-medicion.dto';

export class UpdateMedicionDto extends PartialType(CreateMedicionDto) {}
