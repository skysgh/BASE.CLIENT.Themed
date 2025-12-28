import { ServicePricingPlanDto } from '../models/dtos/service-pricing-plan.dto';
import { ServicePricingPlanViewModel } from '../models/view-models/service-pricing-plan.view-model';

export function mapServicePricingPlanDtoToViewModel(dto: ServicePricingPlanDto): ServicePricingPlanViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    monthlyRate: dto.monthlyRate,
    yearlyRate: dto.yearlyRate,
    enabled: dto.enabled
  };
}

export function mapServicePricingPlanDtosToViewModels(dtos: ServicePricingPlanDto[]): ServicePricingPlanViewModel[] {
  return dtos.map(mapServicePricingPlanDtoToViewModel);
}
