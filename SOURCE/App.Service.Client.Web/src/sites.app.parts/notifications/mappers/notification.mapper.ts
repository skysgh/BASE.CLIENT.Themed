/**
 * Notification Mapper
 * 
 * Maps NotificationDto to NotificationViewModel.
 */
import { NotificationDto } from '../models/notification.dto';
import { NotificationViewModel, NOTIFICATION_TYPE_CONFIG } from '../models/notification.view-model';

export function mapNotificationDtoToViewModel(dto: NotificationDto): NotificationViewModel {
  const sentUtc = new Date(dto.sentUtc);
  const typeConfig = NOTIFICATION_TYPE_CONFIG[dto.typeFK] || NOTIFICATION_TYPE_CONFIG['info'];
  
  return {
    id: dto.id,
    title: dto.title,
    message: dto.description,
    type: dto.typeFK,
    isRead: dto.read ?? false,
    createdAt: sentUtc,
    timeAgo: getTimeAgo(sentUtc),
    typeIcon: typeConfig.icon,
    typeColor: typeConfig.color,
    imageUrl: dto.imageId ? `/api/files/${dto.imageId}` : undefined,
    imageName: dto.imageName,
  };
}

export function mapNotificationDtosToViewModels(dtos: NotificationDto[]): NotificationViewModel[] {
  return dtos.map(mapNotificationDtoToViewModel);
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
