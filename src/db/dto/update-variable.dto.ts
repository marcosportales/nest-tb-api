import { PartialType } from '@nestjs/mapped-types';
import { CreateVariableDto } from '@/db/dto/create-variable.dto';

export class UpdateVariableDto extends PartialType(CreateVariableDto) {}
