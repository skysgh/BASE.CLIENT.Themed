export interface ServiceStatsViewModel {
  id: string;
  title: string;
  description: string;
  imageId: string;
  value: number;
  decimalPlaces: number;
  prefix: string;
  suffix: string;
  changeDirection: number;
  enabled: boolean;
}
