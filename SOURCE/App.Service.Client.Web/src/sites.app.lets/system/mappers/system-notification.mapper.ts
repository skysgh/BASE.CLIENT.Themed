import { SystemNotificationDto } from '../models/dtos/system-notification.dto';
import { SystemNotificationViewModel } from '../models/view-models/system-notification.view-model';

export function mapSystemNotificationDtoToViewModel(dto: SystemNotificationDto): SystemNotificationViewModel {
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

export function mapSystemNotificationDtosToViewModels(dtos: SystemNotificationDto[]): SystemNotificationViewModel[] {
  return dtos.map(mapSystemNotificationDtoToViewModel);
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
