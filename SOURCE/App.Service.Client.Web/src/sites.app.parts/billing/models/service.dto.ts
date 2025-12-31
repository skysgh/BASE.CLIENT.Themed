/**
 * Service DTO
 * 
 * A Service is an ABSTRACT PRODUCT TYPE.
 * It represents what you're offering, not how it's packaged.
 * 
 * Implements:
 * - IHasUUID: Has id field
 * - IHasTitleAndDescription: Has name (title) and description
 * - IHasStatus: Has status field
 * - IHasTimestamps: Has createdUtc/modifiedUtc
 * - IHasMetadata: Has flexible key-value pairs
 * 
 * KEY INSIGHT: Service vs Plan vs Subscription
 * - Service = Abstract product type (what you offer)
 * - Plan = Packaged offering with quotas/features/price (how you sell it)
 * - Subscription = Account's relationship to a specific Plan (who bought it)
 * 
 * Examples:
 * - Service: "Cloud Storage" 
 *   - Plans: "Free (5GB)", "Basic (100GB)", "Pro (1TB)", "Enterprise (Unlimited)"
 * 
 * - Service: "Video Streaming"
 *   - Plans: "Basic (SD)", "Standard (HD)", "Premium (4K)"
 */
import { IHasUUID } from '../../../core/models/contracts/IHasUUID';
import { IHasTitleAndDescription } from '../../../core/models/contracts/IHasTitleAndDescription';
import { IHasStatus } from '../../../core/models/contracts/IHasStatus';
import { IHasTimestamps } from '../../../core/models/contracts/IHasTimestamps';
import { IHasMetadata } from '../../../core/models/contracts/IHasMetadata';

/**
 * Service status
 */
export type ServiceStatus = 
  | 'active'      // Available for new subscriptions
  | 'deprecated'  // No new subscriptions, existing continue
  | 'retired';    // Completely unavailable

/**
 * Service category (for organization/filtering)
 */
export type ServiceCategory = 
  | 'core'        // Core platform features
  | 'addon'       // Optional add-on services
  | 'integration' // Third-party integrations
  | 'support'     // Support packages
  | 'other';

/**
 * Service DTO
 */
export interface ServiceDto extends
  IHasUUID,
  IHasTitleAndDescription,
  IHasStatus<ServiceStatus>,
  IHasTimestamps,
  IHasMetadata {
  
  /**
   * URL-friendly slug
   * Examples: "cloud-storage", "video-streaming", "amazon-prime"
   */
  slug: string;

  /**
   * Display name (alias for title from IHasTitleAndDescription)
   */
  name: string;

  /**
   * Long description (markdown supported)
   */
  longDescription?: string;

  /**
   * Category for organization
   */
  category: ServiceCategory;

  /**
   * Icon class (e.g., "ri-cloud-line")
   */
  icon?: string;

  /**
   * Feature image URL
   */
  imageUrl?: string;

  /**
   * Sort order for display
   */
  sortOrder: number;

  /**
   * External documentation URL
   */
  documentationUrl?: string;

  /**
   * Available plan IDs (references to Plan)
   */
  planIds: string[];
}

/**
 * Service summary (for listings)
 */
export interface ServiceSummaryDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ServiceCategory;
  status: ServiceStatus;
  icon?: string;
  planCount: number;
  startingPrice?: number;  // Lowest plan price (cents)
  currency?: string;
}
