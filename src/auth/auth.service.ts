import { AxiosConfigService } from '@/axios.config';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosInstance } from 'axios';

@Injectable()
export class AuthService {
  private readonly axiosInstance: AxiosInstance;
  private accessToken: string | null;
  private readonly logger: Logger = new Logger('AuthService');

  constructor(
    private readonly configService: ConfigService,
    private readonly axiosConfigService: AxiosConfigService,
  ) {
    this.axiosInstance = this.axiosConfigService.getAxiosInstance();
  }

  get_access_token() {
    return this.accessToken;
  }

  async tbLogin(): Promise<string | null> {
    const TB_LOGIN_URL = this.configService.get<string>('TB_LOGIN_URL');
    const username = this.configService.get<string>('TB_USERNAME');
    const password = this.configService.get<string>('TB_PASSWORD');

    try {
      const response = await this.axiosInstance.post(TB_LOGIN_URL, {
        username,
        password,
      });

      return response.status === 200 ? response.data.token : null;
    } catch (error) {
      if (error instanceof AxiosError) this.logger.error(error.message);
      return null;
    }
  }

  async updateAccessToken() {
    const token = await this.tbLogin();
    this.accessToken = token;
    this.logger.log('JWT updated successfully');
    return token;
  }
}
