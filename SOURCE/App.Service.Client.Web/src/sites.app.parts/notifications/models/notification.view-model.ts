/**
 * Notification ViewModel
 * 
 * UI-ready notification model with computed display properties.
 */
export interface NotificationViewModel {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  
  // Display helpers
  timeAgo: string;
  typeIcon: string;
  typeColor: string;
  
  // Optional image
  imageUrl?: string;
  imageName?: string;
}

/** Notification type display configuration */
export const NOTIFICATION_TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  system: { icon: 'ri-settings-3-line', color: 'primary', label: 'System' },
  activity: { icon: 'ri-notification-3-line', color: 'info', label: 'Activity' },
  alert: { icon: 'ri-alert-line', color: 'warning', label: 'Alert' },
  info: { icon: 'ri-information-line', color: 'secondary', label: 'Info' },
};
