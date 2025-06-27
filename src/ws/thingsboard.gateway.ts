import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { ConfigService } from '@nestjs/config';
import { ITelemetryData } from '@/ws/dto/telemetry_data.dto';
import { DISCONNECT_REASONS, ENVIRONMENT } from '@/constants';
import { AuthService } from '@/auth/auth.service';
import { DbService } from '@/db/db.service';
import { Logger } from '@nestjs/common';

export interface SubscriptionMessage {
  tsSubCmds: Array<{
    entityType: string;
    entityId: string;
    scope: string;
    type: string;
    cmdId: number;
    tsStart?: number;
  }>;
  historyCmd?: Array<any>;
}

@WebSocketGateway()
export class ThingsboardGateway implements OnGatewayInit {
  private ws: WebSocket;
  private TB_WS_URL: string;
  private TB_DEVICE_ID: string;
  private RESEND_TIMEOUT: number;
  private intervalId: NodeJS.Timeout;
  private readonly logger = new Logger('ThingsboardGateway');

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly dbService: DbService,
  ) {}

  async afterInit() {
    const TB_HOST = this.configService.get<string>('TB_HOST');
    this.TB_DEVICE_ID = this.configService.get<string>('TB_DEVICE_ID');
    this.RESEND_TIMEOUT = this.configService.get<number>('RESEND_TIMEOUT');
    const NODE_ENV = this.configService.get<string>('NODE_ENV');
    const PROTOCOL = NODE_ENV === ENVIRONMENT.production ? 'wss' : 'ws';
    // before start connection generates a JWT
    const accessToken = await this.authService.updateAccessToken();
    this.TB_WS_URL = `${PROTOCOL}://${TB_HOST}/api/ws/plugins/telemetry?token=${accessToken}`;
    this.connectWebSocket();
  }

  private connectWebSocket() {
    this.ws = new WebSocket(this.TB_WS_URL);

    this.ws.on('open', () => {
      this.logger.log('Connected to Thingsboard WebSocket!');
      const subscriptionMessage: SubscriptionMessage = {
        tsSubCmds: [
          {
            entityType: 'DEVICE',
            entityId: this.TB_DEVICE_ID,
            scope: 'LATEST_TELEMETRY',
            type: 'TIMESERIES',
            cmdId: 1,
          },
        ],
      };
      this.sendMessage(JSON.stringify(subscriptionMessage));
    });

    this.ws.on('message', async (data) => {
      this.logger.log('Receiving data from Thingsboard WebSocket');
      const parsedData: ITelemetryData = JSON.parse(data.toString());
      if (parsedData.errorCode !== 0 || parsedData.errorMessage) return;
      this.logger.log(JSON.stringify(parsedData));
      await this.dbService.processTelemetry(parsedData);
    });

    this.ws.on('close', async (_, reason) => {
      this.logger.log(
        'Disconnected from Thingsboard WebSocket for reason: ',
        reason.toString(),
      );
      switch (reason.toString()) {
        // if JWT has expired, we need to get a new one
        case DISCONNECT_REASONS.JWT_EXPIRED: {
          this.logger.log('JWT has expired, trying to get newer...');
          await this.authService.updateAccessToken();
          return this.connectWebSocket();
        }
      }
    });

    this.ws.on('error', (err) => {
      this.logger.error('Error connecting to Thingsboard WebSocket: ', err);
      this.ws.close();
    });
  }

  private sendMessage(data: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
      return clearInterval(this.intervalId);
    } else {
      this.logger.log(
        `WebSocket not ready, message not sent, will try it again in ${this.RESEND_TIMEOUT} milliseconds...`,
      );
      this.intervalId = setInterval(
        () => this.sendMessage(data),
        this.RESEND_TIMEOUT,
      );
    }
  }
}
