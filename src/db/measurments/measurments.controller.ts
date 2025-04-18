import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MeasurementsService } from '@/db/measurments/measurments.service';
import { PaginationDto } from '@/db/dto/pagination.dto';
import { CreateMeasurementDto } from '@/db/dto/create-measurement.dto';

@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Get()
  async getAll(@Query() queryParams: PaginationDto) {
    return this.measurementsService.findAll(queryParams);
  }

  @Post()
  async create(@Body() createMeasurementDto: CreateMeasurementDto) {
    return this.measurementsService.create(createMeasurementDto);
  }
}
