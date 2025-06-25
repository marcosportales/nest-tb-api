import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('predictions')
export class Prediction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  predicted_value: number;
}
