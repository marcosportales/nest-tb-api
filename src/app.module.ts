import { Module } from '@nestjs/common';
import { ThingsboardGateway } from '@/ws/thingsboard.gateway';
import { ConfigModule } from '@nestjs/config';
import { DbController } from '@/db/db.controller';
import { DbService } from '@/db/db.service';
import { AxiosConfigService } from './axios.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicion } from '@/entities/medicion.entity';
import { Variable } from '@/entities/variable.entity';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { VariableService } from './db/variable/variable.service';
import { MedicionService } from './db/medicion/medicion.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Variable, Medicion],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Variable, Medicion]),
  ],
  providers: [
    ThingsboardGateway,
    DbService,
    AuthService,
    AxiosConfigService,
    VariableService,
    MedicionService,
  ],
  controllers: [DbController, AuthController],
})
export class AppModule {}
