import { BrochurePricingPlanDto } from '../models/dtos/brochure-pricing-plan.dto';
import { BrochurePricingPlanViewModel } from '../models/view-models/brochure-pricing-plan.view-model';

export function mapBrochurePricingPlanDtoToViewModel(dto: BrochurePricingPlanDto): BrochurePricingPlanViewModel {
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

export function mapBrochurePricingPlanDtosToViewModels(dtos: BrochurePricingPlanDto[]): BrochurePricingPlanViewModel[] {
  return dtos.map(mapBrochurePricingPlanDtoToViewModel);
}
