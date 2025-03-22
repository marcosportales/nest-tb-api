import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Variable } from './variable.entity';

@Entity('measurements')
export class Measurement {
  @PrimaryColumn()
  variable_id: number;

  @PrimaryColumn({ type: 'varchar' })
  date: string;

  @PrimaryColumn({ type: 'varchar' })
  time: string;

  @Column({ type: 'jsonb' })
  value: string | number | boolean;

  @ManyToOne(() => Variable, (variable) => variable.measurements)
  @JoinColumn({ name: 'variable_id' })
  variable: Variable;
}
