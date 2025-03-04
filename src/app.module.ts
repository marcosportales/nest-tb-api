import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThingsboardGateway } from '@/ws/thingsboard.gateway';
import { AxiosConfigService } from './axios.config';
import { DbModule } from '@/db/db.module';
import { AuthModule } from '@/auth/auth.module';
import { Variable } from '@/db/entities/variable.entity';
import { Medicion } from '@/db/entities/medicion.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Variable, Medicion],
      autoLoadEntities: true,
      logging: true,
      synchronize: false,
      migrations: ['dist/db/migrations/*{.ts,.js}'],
      migrationsRun: true,
    }),
    DbModule,
    AuthModule,
  ],
  providers: [ThingsboardGateway, AxiosConfigService],
  exports: [AxiosConfigService],
})
export class AppModule {}
