import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Medicion } from '@/entities/medicion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MedicionService {
  constructor(
    @InjectRepository(Medicion)
    private readonly mediciones_repository: Repository<Medicion>,
  ) {}

  async getAllMediciones(): Promise<Medicion[]> {
    return await this.mediciones_repository.find();
  }

  async saveMedicion(mediciones: Partial<Medicion>[]): Promise<Medicion[]> {
    return await this.mediciones_repository.save(mediciones);
  }
}
