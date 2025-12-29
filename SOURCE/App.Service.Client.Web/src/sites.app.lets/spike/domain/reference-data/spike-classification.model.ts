/**
 * SpikeClassification - Reference Data (Tags)
 * 
 * Tags/labels for spikes. Many-to-many relationship.
 * Examples: urgent, blocked, needs-review, customer-facing
 */

export interface SpikeClassificationDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  color?: string;
  enabled: boolean;
  displayOrder: number;
}

export interface SpikeClassificationViewModel {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  enabled: boolean;
  displayOrder: number;
  displayLabel: string;
}

/**
 * Default spike classifications (seed data)
 */
export const DEFAULT_SPIKE_CLASSIFICATIONS: SpikeClassificationDto[] = [
  { id: '1', code: 'URGENT', name: 'Urgent', description: 'Requires immediate attention', color: '#dc3545', enabled: true, displayOrder: 1 },
  { id: '2', code: 'BLOCKED', name: 'Blocked', description: 'Cannot proceed', color: '#ffc107', enabled: true, displayOrder: 2 },
  { id: '3', code: 'NEEDS_REVIEW', name: 'Needs Review', description: 'Awaiting review', color: '#17a2b8', enabled: true, displayOrder: 3 },
  { id: '4', code: 'CUSTOMER_FACING', name: 'Customer Facing', description: 'Visible to customers', color: '#28a745', enabled: true, displayOrder: 4 },
  { id: '5', code: 'INTERNAL', name: 'Internal', description: 'Internal only', color: '#6c757d', enabled: true, displayOrder: 5 },
  { id: '6', code: 'TECHNICAL_DEBT', name: 'Technical Debt', description: 'Code quality improvement', color: '#fd7e14', enabled: true, displayOrder: 6 },
];

export function mapSpikeClassificationDtoToViewModel(dto: SpikeClassificationDto): SpikeClassificationViewModel {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    description: dto.description || '',
    color: dto.color || '#6c757d',
    enabled: dto.enabled,
    displayOrder: dto.displayOrder,
    displayLabel: dto.name
  };
}
