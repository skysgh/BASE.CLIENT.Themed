/**
 * SpikeItemType - Reference Data
 * 
 * Types of items a spike can have (like LineItemType for Invoice).
 * Examples: Task, Milestone, Deliverable, Resource
 */

export interface SpikeItemTypeDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  hasQuantity: boolean;
  hasUnitPrice: boolean;
  enabled: boolean;
  displayOrder: number;
}

export interface SpikeItemTypeViewModel {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  hasQuantity: boolean;
  hasUnitPrice: boolean;
  enabled: boolean;
  displayOrder: number;
  displayLabel: string;
}

/**
 * Default spike item types (seed data)
 */
export const DEFAULT_SPIKE_ITEM_TYPES: SpikeItemTypeDto[] = [
  { id: '1', code: 'TASK', name: 'Task', description: 'Work item to be completed', icon: 'bx-task', hasQuantity: true, hasUnitPrice: false, enabled: true, displayOrder: 1 },
  { id: '2', code: 'MILESTONE', name: 'Milestone', description: 'Key checkpoint', icon: 'bx-flag', hasQuantity: false, hasUnitPrice: false, enabled: true, displayOrder: 2 },
  { id: '3', code: 'DELIVERABLE', name: 'Deliverable', description: 'Output to produce', icon: 'bx-package', hasQuantity: true, hasUnitPrice: true, enabled: true, displayOrder: 3 },
  { id: '4', code: 'RESOURCE', name: 'Resource', description: 'Required resource', icon: 'bx-cube', hasQuantity: true, hasUnitPrice: true, enabled: true, displayOrder: 4 },
  { id: '5', code: 'DEPENDENCY', name: 'Dependency', description: 'External dependency', icon: 'bx-link', hasQuantity: false, hasUnitPrice: false, enabled: true, displayOrder: 5 },
];

export function mapSpikeItemTypeDtoToViewModel(dto: SpikeItemTypeDto): SpikeItemTypeViewModel {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    description: dto.description || '',
    icon: dto.icon || 'bx-list-ul',
    hasQuantity: dto.hasQuantity,
    hasUnitPrice: dto.hasUnitPrice,
    enabled: dto.enabled,
    displayOrder: dto.displayOrder,
    displayLabel: dto.name
  };
}
