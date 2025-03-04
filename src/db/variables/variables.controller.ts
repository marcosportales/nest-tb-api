import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { VariablesService } from '@/db/variables/variables.service';
import { PaginationDto } from '@/db/dto/pagination.dto';
import { CreateVariableDto } from '@/db/dto/create-variable.dto';
import { UpdateVariableDto } from '@/db/dto/update-variable.dto';

@Controller('variables')
export class VariablesController {
  constructor(private readonly variablesService: VariablesService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.variablesService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variablesService.findOne(id);
  }

  @Post()
  async create(@Body() createVariableDto: CreateVariableDto) {
    return this.variablesService.create(createVariableDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVariableDto: UpdateVariableDto,
  ) {
    return this.variablesService.update(id, updateVariableDto);
  }
}
