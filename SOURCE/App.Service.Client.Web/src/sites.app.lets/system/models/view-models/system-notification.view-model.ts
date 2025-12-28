export interface SystemNotificationViewModel {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  timeAgo: string;
  // Template compatibility properties
  description?: string;
  imageName?: string;
  imageId?: string;
  sentUtc?: Date;
  enabled?: boolean;
}
