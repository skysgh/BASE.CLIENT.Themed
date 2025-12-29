/**
 * Spike Data Transfer Object
 * 
 * Represents a spike entity as received from/sent to the API.
 * Maps to: app_spike_Spikes collection in JSON-server
 */
export interface SpikeDto {
  /** Unique identifier (UUID format) */
  id: string;
  /** Spike title/name */
  title: string;
  /** Optional description */
  description?: string;
  /** Category ID (FK to app_spike_Categories) */
  categoryId?: string;
  /** Status ID (FK to app_spike_Statuses) */
  statusId?: string;
  /** Due date (ISO string) */
  dueDate?: string;
  /** Completed date (ISO string) - when status changed to complete */
  completedDate?: string;
  /** Estimated effort in hours */
  estimatedEffort?: number;
  /** Actual effort in hours (tracked after completion) */
  actualEffort?: number;
  /** Estimated value/benefit (currency units) */
  estimatedValue?: number;
  /** Actual value realized (currency units) */
  actualValue?: number;
  /** Estimated cost */
  estimatedCost?: number;
  /** Actual cost incurred */
  actualCost?: number;
  /** Priority 1-5 */
  priority?: number;
  /** Complexity 1-5 (for estimation) */
  complexity?: number;
  /** Risk level 1-5 */
  riskLevel?: number;
  /** Confidence percentage (0-100) */
  confidence?: number;
  /** Classification/tag IDs */
  classificationIds?: string[];
  /** Tag IDs (user-defined) */
  tagIds?: string[];
  /** Stakeholders, resources, constraints */
  parts?: SpikePartDto[];
  /** Line items */
  items?: SpikeItemDto[];
  /** Sub-spikes */
  subSpikes?: SubSpikeDto[];
  /** Parent spike ID (for hierarchical spikes) */
  parentId?: string;
  /** Created timestamp (ISO string) */
  createdUtc?: string;
  /** Modified timestamp (ISO string) */
  modifiedUtc?: string;
  /** Created by user ID */
  createdBy?: string;
  /** Modified by user ID */
  modifiedBy?: string;
}

/**
 * Spike Part DTO (value object)
 */
export interface SpikePartDto {
  typeId: string;
  name: string;
  value: string;
  secondaryValue?: string;
  notes?: string;
}

/**
 * Spike Item DTO (child entity)
 */
export interface SpikeItemDto {
  id: string;
  spikeId: string;
  typeId: string;
  description: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  sequence: number;
  notes?: string;
  createdUtc: string;
  modifiedUtc: string;
}

/**
 * Sub-Spike DTO
 */
export interface SubSpikeDto {
  id: string;
  parentSpikeId: string;
  title: string;
  description?: string;
  statusId: string;
  sequence: number;
  dueDate?: string;
  estimatedEffort?: number;
  actualEffort?: number;
  assignedTo?: string;
  parts?: SpikePartDto[];
  items?: SpikeItemDto[];
  createdUtc: string;
  modifiedUtc: string;
}
