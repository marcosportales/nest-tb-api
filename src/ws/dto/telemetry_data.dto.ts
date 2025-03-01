export interface ITelemetryData {
  subscriptionId: number;
  errorCode: number;
  errorMessage: string | null;
  data: { [variable: string]: Array<Array<number | string>> };
  latestValues: { [variable: string]: number };
  tsStart?: number;
}
