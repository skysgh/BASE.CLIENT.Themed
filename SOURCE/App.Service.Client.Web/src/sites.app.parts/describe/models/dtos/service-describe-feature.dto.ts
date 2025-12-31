export interface ServiceDescribeFeatureDto {
  id: string;
  serviceId: string;
  enabled: boolean;
  title: string;
  description: string;
  imageId?: string;
}
