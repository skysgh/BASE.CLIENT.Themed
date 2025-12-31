export interface ServiceOperateNotificationDto {
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
