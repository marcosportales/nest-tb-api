import { Injectable } from '@nestjs/common';
import { Variable } from '@/entities/variable.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VariableService {
  constructor(
    @InjectRepository(Variable)
    private variables_repository: Repository<Variable>,
  ) {}

  async getAllVariables(): Promise<Variable[]> {
    return await this.variables_repository.find();
  }

  async getVariableById(id: number): Promise<Variable> {
    return await this.variables_repository.findOne({ where: { id } });
  }

  async getVariableByName(name: string): Promise<Variable> {
    return await this.variables_repository.findOne({ where: { nombre: name } });
  }

  async saveVariables(vars: Variable[]): Promise<Variable[]> {
    return await this.variables_repository.save(vars);
  }
}
