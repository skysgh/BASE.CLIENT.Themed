/**
 * SpikeTag - Reference Data
 * 
 * Tags for categorizing/labeling spikes (many-to-many).
 * More flexible than Classifications - user-defined.
 */

export interface SpikeTagDto {
  /** Unique identifier */
  id: string;
  /** Tag name */
  name: string;
  /** Display color (hex) */
  color: string;
  /** Icon (optional) */
  icon?: string;
  /** Description */
  description?: string;
  /** Is system tag (cannot be deleted) */
  isSystem: boolean;
  /** Usage count */
  usageCount?: number;
}

export interface SpikeTagViewModel {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  isSystem: boolean;
  usageCount: number;
  displayLabel: string;
}

/**
 * Map SpikeTag DTO to ViewModel
 */
export function mapSpikeTagDtoToViewModel(dto: SpikeTagDto): SpikeTagViewModel {
  return {
    id: dto.id,
    name: dto.name,
    color: dto.color,
    icon: dto.icon || 'bx-tag',
    description: dto.description || '',
    isSystem: dto.isSystem,
    usageCount: dto.usageCount ?? 0,
    displayLabel: dto.name
  };
}

/**
 * Default tags
 */
export const DEFAULT_SPIKE_TAGS: SpikeTagDto[] = [
  { id: 'tag-urgent', name: 'Urgent', color: '#f06548', icon: 'bx-alarm-exclamation', isSystem: true },
  { id: 'tag-blocked', name: 'Blocked', color: '#f7b84b', icon: 'bx-block', isSystem: true },
  { id: 'tag-reviewed', name: 'Reviewed', color: '#0ab39c', icon: 'bx-check-circle', isSystem: true },
  { id: 'tag-needs-input', name: 'Needs Input', color: '#299cdb', icon: 'bx-message-dots', isSystem: true },
  { id: 'tag-technical', name: 'Technical', color: '#405189', icon: 'bx-cog', isSystem: false },
  { id: 'tag-business', name: 'Business', color: '#3577f1', icon: 'bx-briefcase', isSystem: false },
  { id: 'tag-research', name: 'Research', color: '#6c757d', icon: 'bx-search-alt', isSystem: false },
];
