/**
 * Support Item DTO
 * 
 * Data Transfer Object for support items (issues/ideas).
 * Matches the shape of data from API/JSON.
 */
import { SupportItemType, SupportItemStatus, SupportPriority } from '../constants';

export interface SupportItemDto {
  /** Unique identifier */
  id: string;
  /** Item type: issue or idea */
  type: SupportItemType;
  /** Title/summary */
  title: string;
  /** Detailed description */
  description: string;
  /** Current status */
  status: SupportItemStatus;
  /** Priority level */
  priority: SupportPriority;
  /** User who submitted (userId) */
  submittedBy: string;
  /** User's display name (denormalized for display) */
  submittedByName?: string;
  /** Assigned admin user (userId) */
  assignedTo?: string;
  /** Assigned admin's display name */
  assignedToName?: string;
  /** Category/tag */
  category?: string;
  /** External ticket ID (Jira, DevOps, etc.) */
  externalId?: string;
  /** External ticket URL */
  externalUrl?: string;
  /** Created timestamp */
  createdUtc: string;
  /** Last updated timestamp */
  updatedUtc: string;
  /** Resolved timestamp (if resolved/closed) */
  resolvedUtc?: string;
}

/**
 * Support Comment DTO
 * 
 * Comments on a support item.
 */
export interface SupportCommentDto {
  /** Comment ID */
  id: string;
  /** Parent item ID */
  itemId: string;
  /** Author user ID */
  authorId: string;
  /** Author display name */
  authorName?: string;
  /** Comment content */
  content: string;
  /** Is this an internal admin note? */
  internal: boolean;
  /** Created timestamp */
  createdUtc: string;
}
