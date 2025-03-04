import { Variable } from '@/db/entities/variable.entity';
import { Medicion } from '@/db/entities/medicion.entity';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Variable, Medicion],
  synchronize: false,
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  migrationsRun: true,
});
