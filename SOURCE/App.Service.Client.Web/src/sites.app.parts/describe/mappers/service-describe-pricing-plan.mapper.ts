import { ServiceDescribePricingPlanDto } from '../models/dtos/service-describe-pricing-plan.dto';
import { ServiceDescribePricingPlanViewModel } from '../models/view-models/service-describe-pricing-plan.view-model';

export function mapServiceDescribePricingPlanDtoToViewModel(dto: ServiceDescribePricingPlanDto): ServiceDescribePricingPlanViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    monthlyRate: dto.monthlyRate,
    yearlyRate: dto.yearlyRate,
    enabled: dto.enabled,
    ribbon: dto.ribbon,
    naturalOrder: dto.naturalOrder
  };
}

export function mapServiceDescribePricingPlanDtosToViewModels(dtos: ServiceDescribePricingPlanDto[]): ServiceDescribePricingPlanViewModel[] {
  return dtos.map(mapServiceDescribePricingPlanDtoToViewModel);
}
