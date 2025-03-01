import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Variable } from './variable.entity';

@Entity('mediciones')
export class Medicion {
  @PrimaryColumn()
  variable_id: number;

  @PrimaryColumn({ type: 'date' })
  date: string;

  @PrimaryColumn({ type: 'time' })
  time: string;

  @Column({ type: 'jsonb' })
  value: string | number | boolean;

  @ManyToOne(() => Variable, (variable) => variable.mediciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variable_id' })
  variable: Variable;
}
