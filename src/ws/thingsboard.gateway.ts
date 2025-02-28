import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { ConfigService } from '@nestjs/config';
import { ITelemetryData } from '@/dto/telemetry_data.dto';
import { DISCONNECT_REASONS } from '@/constants';
import { AuthService } from '@/auth/auth.service';
import { DbService } from '@/db/db.service';

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
  private TB_TIMEOUT: number;
  private RESEND_TIMEOUT: number;
  private interval_id: NodeJS.Timeout;

  constructor(
    private readonly configService: ConfigService,
    private readonly auth_service: AuthService,
    private readonly db_service: DbService,
  ) {}

  async afterInit() {
    const TB_HOST = this.configService.get<string>('TB_HOST');
    this.TB_DEVICE_ID = this.configService.get<string>('TB_DEVICE_ID');
    this.TB_TIMEOUT = this.configService.get<number>('TB_TIMEOUT');
    this.RESEND_TIMEOUT = this.configService.get<number>('RESEND_TIMEOUT');
    // before start connection generates a JWT
    const access_token = await this.auth_service.updateAccessToken();
    this.TB_WS_URL = `ws://${TB_HOST}/api/ws/plugins/telemetry?token=${access_token}`;
    this.connectWebSocket();
  }

  private connectWebSocket() {
    this.ws = new WebSocket(this.TB_WS_URL);

    this.ws.on('open', () => {
      console.log('Connected to Thingsboard WebSocket');
      const subscription_message: SubscriptionMessage = {
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
      this.sendMessage(JSON.stringify(subscription_message));
    });

    this.ws.on('message', async (data) => {
      console.log('Receiving data from Thingsboard WebSocket');
      const parsed_data: ITelemetryData = JSON.parse(data.toString());
      if (parsed_data.errorCode !== 0 || parsed_data.errorMessage) return;
      console.log(data.toString());
      await this.db_service.processTelemetry(parsed_data);
    });

    this.ws.on('close', async (_, reason) => {
      console.log(
        'Disconnected from Thingsboard WebSocket for reason: ',
        reason.toString(),
      );
      switch (reason.toString()) {
        // if JWT has expired, we need to get a new one
        case DISCONNECT_REASONS.JWT_EXPIRED: {
          console.log('JWT has expired, trying to get newer...');
          return await this.auth_service.updateAccessToken();
        }
      }
      this.connectWebSocket();
    });

    this.ws.on('error', (err) => {
      console.log('Error connecting to Thingsboard WebSocket: ', err);
      // Reconnect to websocket
      this.ws.close();
      this.connectWebSocket();
    });
  }

  private sendMessage(data: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
      return clearInterval(this.interval_id);
    } else {
      console.log(
        `WebSocket not ready, message not sent, will try it again in ${this.RESEND_TIMEOUT} milliseconds...`,
      );
      this.interval_id = setInterval(
        () => this.sendMessage(data),
        this.RESEND_TIMEOUT,
      );
    }
  }
}
