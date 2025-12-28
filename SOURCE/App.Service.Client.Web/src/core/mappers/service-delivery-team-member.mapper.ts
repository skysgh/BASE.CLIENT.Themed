import { ServiceDeliveryTeamMemberDto } from '../models/dtos/service-delivery-team-member.dto';
import { ServiceDeliveryTeamMemberViewModel } from '../models/view-models/service-delivery-team-member.view-model';

export function mapServiceDeliveryTeamMemberDtoToViewModel(
  dto: ServiceDeliveryTeamMemberDto
): ServiceDeliveryTeamMemberViewModel {
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

export function mapServiceDeliveryTeamMemberDtosToViewModels(
  dtos: ServiceDeliveryTeamMemberDto[]
): ServiceDeliveryTeamMemberViewModel[] {
  return dtos.map(dto => mapServiceDeliveryTeamMemberDtoToViewModel(dto));
}

export function mapServiceDeliveryTeamMemberViewModelToDto(
  viewModel: ServiceDeliveryTeamMemberViewModel
): ServiceDeliveryTeamMemberDto {
  return {
    id: viewModel.id,
    enabled: viewModel.enabled,
    title: viewModel.name,
    description: viewModel.description,
    role: viewModel.role,
    imageName: viewModel.imageName
  };
}
