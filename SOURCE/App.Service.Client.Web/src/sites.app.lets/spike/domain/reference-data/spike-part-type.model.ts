/**
 * SpikePartType - Reference Data
 * 
 * Types of parts a spike can have (like AddressType for Invoice).
 * Examples: Owner, Reviewer, Stakeholder, Contact
 * 
 * A Spike can have one SpikePart of each SpikePartType.
 */

export interface SpikePartTypeDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  required: boolean;
  maxCount: number;  // 1 = single, >1 = multiple allowed
  enabled: boolean;
  displayOrder: number;
}

export interface SpikePartTypeViewModel {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  required: boolean;
  maxCount: number;
  enabled: boolean;
  displayOrder: number;
  displayLabel: string;
}

/**
 * Default spike part types (seed data)
 */
export const DEFAULT_SPIKE_PART_TYPES: SpikePartTypeDto[] = [
  { id: '1', code: 'OWNER', name: 'Owner', description: 'Primary responsible party', icon: 'bx-user-check', required: true, maxCount: 1, enabled: true, displayOrder: 1 },
  { id: '2', code: 'REVIEWER', name: 'Reviewer', description: 'Approval reviewer', icon: 'bx-user-voice', required: false, maxCount: 3, enabled: true, displayOrder: 2 },
  { id: '3', code: 'STAKEHOLDER', name: 'Stakeholder', description: 'Interested party', icon: 'bx-group', required: false, maxCount: 10, enabled: true, displayOrder: 3 },
  { id: '4', code: 'CONTACT', name: 'Contact', description: 'External contact', icon: 'bx-phone', required: false, maxCount: 5, enabled: true, displayOrder: 4 },
  { id: '5', code: 'SPONSOR', name: 'Sponsor', description: 'Executive sponsor', icon: 'bx-crown', required: false, maxCount: 1, enabled: true, displayOrder: 5 },
];

export function mapSpikePartTypeDtoToViewModel(dto: SpikePartTypeDto): SpikePartTypeViewModel {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    description: dto.description || '',
    icon: dto.icon || 'bx-user',
    required: dto.required,
    maxCount: dto.maxCount,
    enabled: dto.enabled,
    displayOrder: dto.displayOrder,
    displayLabel: `${dto.name}${dto.required ? ' *' : ''}`
  };
}
