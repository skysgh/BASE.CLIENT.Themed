import { ServiceOperateNotificationDto } from '../models/dtos/service-operate-notification.dto';
import { ServiceOperateNotificationViewModel } from '../models/view-models/service-operate-notification.view-model';

export function mapServiceOperateNotificationDtoToViewModel(dto: ServiceOperateNotificationDto): ServiceOperateNotificationViewModel {
  const sentUtc = new Date(dto.sentUtc);
  return {
    id: dto.id,
    title: dto.title,
    message: dto.description,
    type: dto.typeFK,
    isRead: dto.read ?? false,
    createdAt: sentUtc,
    timeAgo: getTimeAgo(sentUtc),
    // Template compatibility properties
    description: dto.description,
    imageName: dto.imageName,
    imageId: dto.imageId,
    sentUtc: sentUtc,
    enabled: dto.enabled
  };
}

export function mapServiceOperateNotificationDtosToViewModels(dtos: ServiceOperateNotificationDto[]): ServiceOperateNotificationViewModel[] {
  return dtos.map(mapServiceOperateNotificationDtoToViewModel);
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}
