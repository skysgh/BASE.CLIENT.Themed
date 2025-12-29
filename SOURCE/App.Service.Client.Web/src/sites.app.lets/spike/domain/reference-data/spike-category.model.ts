/**
 * SpikeCategory - Reference Data
 * 
 * Categorizes spikes by type (Feature, Bug, Research, etc.)
 * This is reference data - read-only, loaded from API/static.
 */

export interface SpikeCategoryDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  enabled: boolean;
  displayOrder: number;
}

export interface SpikeCategoryViewModel {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
  displayOrder: number;
  displayLabel: string;
}

/**
 * Default spike categories (seed data)
 */
export const DEFAULT_SPIKE_CATEGORIES: SpikeCategoryDto[] = [
  { id: '1', code: 'FEATURE', name: 'Feature', description: 'New functionality', icon: 'bx-bulb', color: '#28a745', enabled: true, displayOrder: 1 },
  { id: '2', code: 'BUG', name: 'Bug Fix', description: 'Defect correction', icon: 'bx-bug', color: '#dc3545', enabled: true, displayOrder: 2 },
  { id: '3', code: 'RESEARCH', name: 'Research', description: 'Investigation/discovery', icon: 'bx-search', color: '#007bff', enabled: true, displayOrder: 3 },
  { id: '4', code: 'IMPROVEMENT', name: 'Improvement', description: 'Enhancement to existing', icon: 'bx-trending-up', color: '#17a2b8', enabled: true, displayOrder: 4 },
  { id: '5', code: 'MAINTENANCE', name: 'Maintenance', description: 'Technical debt/cleanup', icon: 'bx-wrench', color: '#6c757d', enabled: true, displayOrder: 5 },
];

export function mapSpikeCategoryDtoToViewModel(dto: SpikeCategoryDto): SpikeCategoryViewModel {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    description: dto.description || '',
    icon: dto.icon || 'bx-category',
    color: dto.color || '#6c757d',
    enabled: dto.enabled,
    displayOrder: dto.displayOrder,
    displayLabel: `${dto.name} (${dto.code})`
  };
}
