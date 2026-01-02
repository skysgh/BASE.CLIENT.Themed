/**
 * Support Item ViewModel
 * 
 * UI-ready model with computed/display properties.
 */
import { 
  SupportItemType, 
  SupportItemStatus, 
  SupportPriority,
  getStatusConfig,
  getTypeConfig,
  getPriorityConfig,
  getStatusProgress,
} from '../constants';

export interface SupportItemViewModel {
  // Identity
  id: string;
  
  // Type
  type: SupportItemType;
  typeName: string;
  typeIcon: string;
  typeColor: string;
  
  // Content
  title: string;
  description: string;
  
  // Status
  status: SupportItemStatus;
  statusName: string;
  statusIcon: string;
  statusColor: string;
  /** Progress percentage (0-100) based on status */
  progressPercent: number;
  
  // Priority
  priority: SupportPriority;
  priorityName: string;
  priorityIcon: string;
  priorityColor: string;
  
  // People
  submittedBy: string;
  submittedByName: string;
  assignedTo?: string;
  assignedToName?: string;
  
  // Metadata
  category?: string;
  externalId?: string;
  externalUrl?: string;
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  
  // Computed
  /** Display label for lists */
  displayLabel: string;
  /** Is this item open (not closed)? */
  isOpen: boolean;
  /** Time since creation (for display) */
  ageLabel: string;
}

/**
 * Support Comment ViewModel
 */
export interface SupportCommentViewModel {
  id: string;
  itemId: string;
  authorId: string;
  authorName: string;
  content: string;
  internal: boolean;
  createdAt: Date;
  /** Time since creation */
  ageLabel: string;
}

/**
 * Stats for support dashboard
 */
export interface SupportStatsViewModel {
  totalItems: number;
  openItems: number;
  resolvedItems: number;
  closedItems: number;
  issueCount: number;
  ideaCount: number;
}
