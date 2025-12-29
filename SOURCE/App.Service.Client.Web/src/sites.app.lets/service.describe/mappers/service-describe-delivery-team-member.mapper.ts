import { ServiceDescribeDeliveryTeamMemberDto } from '../models/dtos/service-describe-delivery-team-member.dto';
import { ServiceDescribeDeliveryTeamMemberViewModel } from '../models/view-models/service-describe-delivery-team-member.view-model';

export function mapServiceDescribeDeliveryTeamMemberDtoToViewModel(
  dto: ServiceDescribeDeliveryTeamMemberDto
): ServiceDescribeDeliveryTeamMemberViewModel {
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

export function mapServiceDescribeDeliveryTeamMemberDtosToViewModels(
  dtos: ServiceDescribeDeliveryTeamMemberDto[]
): ServiceDescribeDeliveryTeamMemberViewModel[] {
  return dtos.map(mapServiceDescribeDeliveryTeamMemberDtoToViewModel);
}

export function mapServiceDescribeDeliveryTeamMemberViewModelToDto(
  vm: ServiceDescribeDeliveryTeamMemberViewModel
): ServiceDescribeDeliveryTeamMemberDto {
  return {
    id: vm.id,
    enabled: vm.enabled,
    title: vm.name,
    description: vm.description,
    role: vm.role,
    imageName: vm.imageName
  };
}
