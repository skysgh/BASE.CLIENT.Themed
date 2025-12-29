import { ServiceOperateUserDto } from '../models/dtos/service-operate-user.dto';
import { ServiceOperateUserViewModel } from '../models/view-models/service-operate-user.view-model';

export function mapServiceOperateUserDtoToViewModel(dto: ServiceOperateUserDto): ServiceOperateUserViewModel {
  return {
    id: dto.id,
    email: dto.email,
    displayName: dto.displayName,
    role: dto.role,
    enabled: dto.enabled
  };
}

export function mapServiceOperateUserDtosToViewModels(dtos: ServiceOperateUserDto[]): ServiceOperateUserViewModel[] {
  return dtos.map(mapServiceOperateUserDtoToViewModel);
}
