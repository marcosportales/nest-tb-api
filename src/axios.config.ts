import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AxiosConfigService {
  private static instance: AxiosInstance;

  constructor(private configService: ConfigService) {
    if (!AxiosConfigService.instance) {
      const TB_HOST = this.configService.get<string>('TB_HOST');

      if (!TB_HOST) {
        throw new Error(
          '⚠️ ERROR: La variable de entorno TB_HOST no está definida.',
        );
      }

      AxiosConfigService.instance = axios.create({
        baseURL: `http://${TB_HOST}/`,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

  getAxiosInstance(): AxiosInstance {
    return AxiosConfigService.instance;
  }
}
