import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  Check,
} from 'typeorm';
import { Measurement } from './measurement.entity';

@Entity('variables')
@Unique(['nombre'])
@Check(`io_type IN ('I', 'O')`)
export class Variable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  signal_type: string;

  @Column({ type: 'char', length: 1, nullable: true })
  io_type: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  structure_name: string;

  @OneToMany(() => Measurement, (measurement) => measurement.variable, {
    cascade: true,
  })
  mediciones: Measurement[];
}
