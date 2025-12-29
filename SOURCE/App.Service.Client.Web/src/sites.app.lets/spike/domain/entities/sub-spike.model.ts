/**
 * SubSpike - Child Aggregate
 * 
 * A sub-spike is a child spike that belongs to a parent spike.
 * Enables hierarchical organization of work.
 * 
 * SubSpike has its own:
 * - Status (can progress independently)
 * - Items
 * - Parts
 * 
 * But inherits category from parent.
 */

import { SpikePartDto, SpikePartViewModel } from '../value-objects/spike-part.model';
import { SpikeItemDto, SpikeItemViewModel } from './spike-item.model';

export interface SubSpikeDto {
  /** Unique identifier */
  id: string;
  /** Parent Spike ID */
  parentSpikeId: string;
  /** Title */
  title: string;
  /** Description */
  description?: string;
  /** Status (FK to SpikeStatus) */
  statusId: string;
  /** Sequence/order within parent */
  sequence: number;
  /** Due date (optional, can inherit from parent) */
  dueDate?: string;
  /** Estimated effort (hours) */
  estimatedEffort?: number;
  /** Assigned to user ID */
  assignedTo?: string;
  /** Parts (value objects) */
  parts: SpikePartDto[];
  /** Items (child entities) */
  items: SpikeItemDto[];
  /** Created timestamp */
  createdUtc: string;
  /** Modified timestamp */
  modifiedUtc: string;
}

export interface SubSpikeViewModel {
  // Identity
  id: string;
  parentSpikeId: string;
  
  // Core fields
  title: string;
  description: string;
  sequence: number;
  
  // Status (resolved)
  statusId: string;
  statusName: string;
  statusIcon: string;
  statusColor: string;
  
  // Dates
  dueDate: Date | null;
  dueDateFormatted: string;
  isOverdue: boolean;
  
  // Metrics
  estimatedEffort: number | null;
  
  // Assignment
  assignedTo: string;
  assignedToName: string;
  
  // Nested
  parts: SpikePartViewModel[];
  items: SpikeItemViewModel[];
  
  // Computed
  itemCount: number;
  completionPercentage: number;
  
  // Audit
  createdAt: Date;
  modifiedAt: Date;
  
  // Display
  displayLabel: string;
}

/**
 * Map SubSpike DTO to ViewModel
 */
export function mapSubSpikeDtoToViewModel(
  dto: SubSpikeDto,
  options: {
    statusName?: string;
    statusIcon?: string;
    statusColor?: string;
    assignedToName?: string;
    mapPart?: (part: SpikePartDto) => SpikePartViewModel;
    mapItem?: (item: SpikeItemDto) => SpikeItemViewModel;
  } = {}
): SubSpikeViewModel {
  const dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
  const isOverdue = dueDate ? dueDate < new Date() : false;

  const parts = options.mapPart 
    ? dto.parts.map(options.mapPart) 
    : dto.parts.map(p => ({
        typeId: p.typeId,
        typeName: 'Unknown',
        typeIcon: 'bx-user',
        name: p.name,
        value: p.value,
        secondaryValue: p.secondaryValue || '',
        notes: p.notes || '',
        displayLabel: p.name
      }));

  const items = options.mapItem 
    ? dto.items.map(options.mapItem) 
    : dto.items.map(i => ({
        id: i.id,
        spikeId: i.spikeId,
        typeId: i.typeId,
        typeName: 'Unknown',
        typeIcon: 'bx-list-ul',
        description: i.description,
        quantity: i.quantity ?? null,
        unit: i.unit || '',
        unitPrice: i.unitPrice ?? null,
        sequence: i.sequence,
        notes: i.notes || '',
        createdAt: new Date(i.createdUtc),
        modifiedAt: new Date(i.modifiedUtc),
        lineTotal: (i.quantity && i.unitPrice) ? i.quantity * i.unitPrice : null,
        displayLabel: i.description
      }));

  return {
    id: dto.id,
    parentSpikeId: dto.parentSpikeId,
    title: dto.title,
    description: dto.description || '',
    sequence: dto.sequence,
    
    statusId: dto.statusId,
    statusName: options.statusName || 'Unknown',
    statusIcon: options.statusIcon || 'bx-circle',
    statusColor: options.statusColor || '#6c757d',
    
    dueDate,
    dueDateFormatted: dueDate ? dueDate.toLocaleDateString() : '',
    isOverdue,
    
    estimatedEffort: dto.estimatedEffort ?? null,
    
    assignedTo: dto.assignedTo || '',
    assignedToName: options.assignedToName || '',
    
    parts,
    items,
    
    itemCount: items.length,
    completionPercentage: 0, // TODO: Calculate from items
    
    createdAt: new Date(dto.createdUtc),
    modifiedAt: new Date(dto.modifiedUtc),
    
    displayLabel: dto.title
  };
}

/**
 * Create empty SubSpike
 */
export function createEmptySubSpike(parentSpikeId: string, sequence: number): SubSpikeDto {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    parentSpikeId,
    title: '',
    description: undefined,
    statusId: '1', // Draft
    sequence,
    dueDate: undefined,
    estimatedEffort: undefined,
    assignedTo: undefined,
    parts: [],
    items: [],
    createdUtc: now,
    modifiedUtc: now
  };
}
