import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ThingsboardGateway } from '@/ws/thingsboard.gateway';
import { AxiosConfigService } from './axios.config';
import { Medicion } from '@/db/entities/medicion.entity';
import { Variable } from '@/db/entities/variable.entity';
import { DbModule } from '@/db/db.module';
import { AuthModule } from '@/auth/auth.module';

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
    }),
    DbModule,
    AuthModule,
  ],
  providers: [ThingsboardGateway, AxiosConfigService],
  exports: [AxiosConfigService],
})
export class AppModule {}
