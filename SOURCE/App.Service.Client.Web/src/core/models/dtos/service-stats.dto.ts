export interface ServiceStatsDto {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  imageId: string;
  value: number;
  decimalPlaces: number;
  prefix: string;
  suffix: string;
  changeDirection: number;
}
