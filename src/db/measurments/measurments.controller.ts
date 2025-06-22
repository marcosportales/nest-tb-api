import { Body, Controller, Get, Header, Post, Query } from '@nestjs/common';
import { MeasurementsService } from '@/db/measurments/measurments.service';
import { PaginationDto } from '@/db/dto/pagination.dto';
import { CreateMeasurementDto } from '@/db/dto/create-measurement.dto';

@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Get()
  async getAll(@Query() paginationDto: PaginationDto) {
    return this.measurementsService.findAll(paginationDto);
  }

  @Post()
  async create(@Body() createMeasurementDto: CreateMeasurementDto) {
    return this.measurementsService.create(createMeasurementDto);
  }

  @Get('/export-to-csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="measurements.csv"')
  async exportToCsv(@Query() paginationDto: PaginationDto) {
    return this.measurementsService.exportToCsv(paginationDto);
  }

  @Get('/latests')
  async getLatests() {
    return this.measurementsService.getLatests();
  }
}
