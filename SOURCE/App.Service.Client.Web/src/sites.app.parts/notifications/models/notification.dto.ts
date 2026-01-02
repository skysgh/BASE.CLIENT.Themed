/**
 * Notification DTO
 * 
 * Data transfer object for notifications from API.
 */
export interface NotificationDto {
  id: string;
  enabled: boolean;
  forUserFK: string;
  typeFK: string;
  title: string;
  description: string;
  imageId?: string;
  imageName?: string;
  sentUtc: string;
  checkboxId?: string;
  read?: boolean;
}

/** Notification type IDs */
export type NotificationType = 'system' | 'activity' | 'alert' | 'info';

/** Create notification request */
export interface CreateNotificationDto {
  typeFK: string;
  title: string;
  description: string;
  forUserFK?: string;
}
