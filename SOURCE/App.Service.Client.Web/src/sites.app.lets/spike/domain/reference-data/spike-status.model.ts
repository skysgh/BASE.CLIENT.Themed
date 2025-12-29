/**
 * SpikeStatus - Reference Data (Workflow States)
 * 
 * Workflow states for spikes with allowed transitions.
 * Implements BREAST pattern: State Transition capability.
 * 
 * Workflow:
 *   Draft → Submitted → Approved → Archived
 *                   ↘ Rejected → Revised (Draft)
 */

export interface SpikeStatusDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  /** IDs of statuses this can transition TO */
  allowedTransitionIds: string[];
  /** Is this a terminal state? */
  isFinal: boolean;
  /** Is this the initial state? */
  isInitial: boolean;
  enabled: boolean;
  displayOrder: number;
}

export interface SpikeStatusViewModel {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  allowedTransitionIds: string[];
  isFinal: boolean;
  isInitial: boolean;
  enabled: boolean;
  displayOrder: number;
  displayLabel: string;
}

/**
 * Status codes for type-safe references
 */
export const SPIKE_STATUS_CODES = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type SpikeStatusCode = typeof SPIKE_STATUS_CODES[keyof typeof SPIKE_STATUS_CODES];

/**
 * Default spike statuses (seed data)
 */
export const DEFAULT_SPIKE_STATUSES: SpikeStatusDto[] = [
  { 
    id: '1', 
    code: SPIKE_STATUS_CODES.DRAFT, 
    name: 'Draft', 
    description: 'Work in progress', 
    icon: 'bx-edit', 
    color: '#6c757d', 
    allowedTransitionIds: ['2'], // Can go to Submitted
    isFinal: false, 
    isInitial: true, 
    enabled: true, 
    displayOrder: 1 
  },
  { 
    id: '2', 
    code: SPIKE_STATUS_CODES.SUBMITTED, 
    name: 'Submitted', 
    description: 'Awaiting approval', 
    icon: 'bx-send', 
    color: '#007bff', 
    allowedTransitionIds: ['3', '4'], // Can go to Approved or Rejected
    isFinal: false, 
    isInitial: false, 
    enabled: true, 
    displayOrder: 2 
  },
  { 
    id: '3', 
    code: SPIKE_STATUS_CODES.APPROVED, 
    name: 'Approved', 
    description: 'Approved for implementation', 
    icon: 'bx-check-circle', 
    color: '#28a745', 
    allowedTransitionIds: ['5'], // Can go to Archived
    isFinal: false, 
    isInitial: false, 
    enabled: true, 
    displayOrder: 3 
  },
  { 
    id: '4', 
    code: SPIKE_STATUS_CODES.REJECTED, 
    name: 'Rejected', 
    description: 'Not approved', 
    icon: 'bx-x-circle', 
    color: '#dc3545', 
    allowedTransitionIds: ['1'], // Can go back to Draft
    isFinal: false, 
    isInitial: false, 
    enabled: true, 
    displayOrder: 4 
  },
  { 
    id: '5', 
    code: SPIKE_STATUS_CODES.ARCHIVED, 
    name: 'Archived', 
    description: 'Completed and archived', 
    icon: 'bx-archive', 
    color: '#6c757d', 
    allowedTransitionIds: [], // Terminal state
    isFinal: true, 
    isInitial: false, 
    enabled: true, 
    displayOrder: 5 
  },
];

export function mapSpikeStatusDtoToViewModel(dto: SpikeStatusDto): SpikeStatusViewModel {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    description: dto.description || '',
    icon: dto.icon || 'bx-circle',
    color: dto.color || '#6c757d',
    allowedTransitionIds: dto.allowedTransitionIds,
    isFinal: dto.isFinal,
    isInitial: dto.isInitial,
    enabled: dto.enabled,
    displayOrder: dto.displayOrder,
    displayLabel: dto.name
  };
}

/**
 * Get allowed transitions for a status
 */
export function getAllowedTransitions(
  currentStatusId: string, 
  allStatuses: SpikeStatusViewModel[]
): SpikeStatusViewModel[] {
  const currentStatus = allStatuses.find(s => s.id === currentStatusId);
  if (!currentStatus) return [];
  
  return allStatuses.filter(s => currentStatus.allowedTransitionIds.includes(s.id));
}
