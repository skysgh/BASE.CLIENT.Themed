/**
 * Activity Model
 * 
 * Represents a user activity/event in the system.
 */

export interface Activity {
  id: string;
  title: string;
  description: string;
  icon?: string;
  iconColor?: string;
  type: ActivityType;
  entityType?: string;
  entityId?: string;
  entityRoute?: string;
  createdUtc: string;
  createdByUserId?: string;
  createdByUserName?: string;
}

export type ActivityType = 
  | 'created'
  | 'updated'
  | 'deleted'
  | 'status_changed'
  | 'commented'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'assigned'
  | 'completed';

export const ACTIVITY_TYPE_ICONS: Record<ActivityType, { icon: string; color: string }> = {
  created: { icon: 'bx bx-plus-circle', color: 'success' },
  updated: { icon: 'bx bx-edit', color: 'info' },
  deleted: { icon: 'bx bx-trash', color: 'danger' },
  status_changed: { icon: 'bx bx-transfer', color: 'warning' },
  commented: { icon: 'bx bx-comment', color: 'primary' },
  submitted: { icon: 'bx bx-send', color: 'info' },
  approved: { icon: 'bx bx-check-circle', color: 'success' },
  rejected: { icon: 'bx bx-x-circle', color: 'danger' },
  assigned: { icon: 'bx bx-user-plus', color: 'primary' },
  completed: { icon: 'bx bx-check-double', color: 'success' },
};
