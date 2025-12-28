export interface ServicePricingPlanDto {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  monthlyRate: string;
  yearlyRate: string;
  members?: number;
  groups?: number;
  projects?: number;
  products?: number;
}
