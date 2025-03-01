import { AxiosConfigService } from '@/axios.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance } from 'axios';

@Injectable()
export class AuthService {
  private axiosInstance: AxiosInstance;
  private access_token: string | null;

  constructor(
    private readonly configService: ConfigService,
    private readonly axios_config_service: AxiosConfigService,
  ) {
    this.axiosInstance = this.axios_config_service.getAxiosInstance();
  }

  get_access_token() {
    return this.access_token;
  }

  async login() {
    const TB_LOGIN_URL = this.configService.get<string>('TB_LOGIN_URL');
    const username = this.configService.get<string>('TB_USERNAME');
    const password = this.configService.get<string>('TB_PASSWORD');

    const response = await this.axiosInstance.post(TB_LOGIN_URL, {
      username,
      password,
    });

    return response.status === 200 ? response.data.token : null;
  }

  async updateAccessToken() {
    const token = await this.login();
    this.access_token = token;
    console.log('JWT updated successfully');
    return token;
  }
}
