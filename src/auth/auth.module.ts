import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { AxiosConfigService } from '@/axios.config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AxiosConfigService],
  exports: [AuthService],
})
export class AuthModule {}
