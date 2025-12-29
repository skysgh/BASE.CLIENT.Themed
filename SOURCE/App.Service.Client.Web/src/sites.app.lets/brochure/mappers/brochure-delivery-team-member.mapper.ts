import { BrochureDeliveryTeamMemberDto } from '../models/dtos/brochure-delivery-team-member.dto';
import { BrochureDeliveryTeamMemberViewModel } from '../models/view-models/brochure-delivery-team-member.view-model';

export function mapBrochureDeliveryTeamMemberDtoToViewModel(
  dto: BrochureDeliveryTeamMemberDto
): BrochureDeliveryTeamMemberViewModel {
  return {
    id: dto.id,
    enabled: dto.enabled,
    name: dto.title,
    description: dto.description || '',
    role: dto.role,
    imageName: dto.imageName,
    displayLabel: `${dto.title} - ${dto.role}`,
    imageUrl: `/assets/images/users/${dto.imageName}`
  };
}

export function mapBrochureDeliveryTeamMemberDtosToViewModels(
  dtos: BrochureDeliveryTeamMemberDto[]
): BrochureDeliveryTeamMemberViewModel[] {
  return dtos.map(mapBrochureDeliveryTeamMemberDtoToViewModel);
}

export function mapBrochureDeliveryTeamMemberViewModelToDto(
  vm: BrochureDeliveryTeamMemberViewModel
): BrochureDeliveryTeamMemberDto {
  return {
    id: vm.id,
    enabled: vm.enabled,
    title: vm.name,
    description: vm.description,
    role: vm.role,
    imageName: vm.imageName
  };
}
