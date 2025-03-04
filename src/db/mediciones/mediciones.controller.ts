import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MedicionesService } from '@/db/mediciones/mediciones.service';
import { PaginationDto } from '@/db/dto/pagination.dto';
import { CreateMedicionDto } from '@/db/dto/create-medicion.dto';

@Controller('mediciones')
export class MedicionesController {
  constructor(private readonly medicionesService: MedicionesService) {}

  @Get()
  async getAll(@Query() queryParams: PaginationDto) {
    return this.medicionesService.findAll(queryParams);
  }

  @Post()
  async create(@Body() createMedicionDto: CreateMedicionDto) {
    return this.medicionesService.create(createMedicionDto);
  }
}
