import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MeasurementsService } from '@/db/measurments/measurments.service';
import { PaginationDto } from '@/db/dto/pagination.dto';
import { CreateMedicionDto } from '@/db/dto/create-measurement.dto';

@Controller('mediciones')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Get()
  async getAll(@Query() queryParams: PaginationDto) {
    return this.measurementsService.findAll(queryParams);
  }

  @Post()
  async create(@Body() createMedicionDto: CreateMedicionDto) {
    return this.measurementsService.create(createMedicionDto);
  }
}
