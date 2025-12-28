import { ServiceNotificationDto } from '../models/dtos/service-notification.dto';
import { ServiceNotificationViewModel } from '../models/view-models/service-notification.view-model';

export function mapServiceNotificationDtoToViewModel(dto: ServiceNotificationDto): ServiceNotificationViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    imageId: dto.imageId,
    imageName: dto.imageName,
    sentUtc: new Date(dto.sentUtc),
    enabled: dto.enabled
  };
}

export function mapServiceNotificationDtosToViewModels(dtos: ServiceNotificationDto[]): ServiceNotificationViewModel[] {
  return dtos.map(mapServiceNotificationDtoToViewModel);
}
