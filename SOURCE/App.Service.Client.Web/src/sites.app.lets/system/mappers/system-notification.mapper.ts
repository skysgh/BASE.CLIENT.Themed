import { SystemNotificationDto } from '../models/dtos/system-notification.dto';
import { SystemNotificationViewModel } from '../models/view-models/system-notification.view-model';

export function mapSystemNotificationDtoToViewModel(dto: SystemNotificationDto): SystemNotificationViewModel {
  const createdAt = new Date(dto.createdAt);
  return {
    id: dto.id,
    title: dto.title,
    message: dto.message,
    type: dto.type,
    isRead: dto.read,
    createdAt: createdAt,
    timeAgo: getTimeAgo(createdAt)
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
