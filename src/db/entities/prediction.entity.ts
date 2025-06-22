import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('predictions')
export class Prediction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real' })
  intern_temperature: number;

  @Column({ type: 'real' })
  input_temperature: number;

  @Column({ type: 'real' })
  output_temperature: number;

  @Column({ type: 'real' })
  chimney_temperature: number;

  @Column({ type: 'real' })
  fan_speed: number;
}
