export interface BrochurePricingPlanDto {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  monthlyRate: number;
  yearlyRate: number;
  ribbon?: string;
  naturalOrder?: number;
}
