export interface SystemNotificationViewModel {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  timeAgo: string;
}
