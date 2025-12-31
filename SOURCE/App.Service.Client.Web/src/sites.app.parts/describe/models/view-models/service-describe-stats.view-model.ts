export interface ServiceDescribeStatsViewModel {
  id: string;
  title: string;
  value: number;
  description: string;
  enabled: boolean;
  // Optional UI properties
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
  imageId?: string;
  changeDirection?: number;
}
