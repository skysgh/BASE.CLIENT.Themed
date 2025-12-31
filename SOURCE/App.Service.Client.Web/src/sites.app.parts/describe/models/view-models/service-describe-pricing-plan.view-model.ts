export interface ServiceDescribePricingPlanViewModel {
  id: string;
  title: string;
  description: string;
  monthlyRate: number;
  yearlyRate: number;
  enabled: boolean;
  ribbon?: string;
  naturalOrder?: number;
}
