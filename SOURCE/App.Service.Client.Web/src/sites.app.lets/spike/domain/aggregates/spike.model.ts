/**
 * Spike - Aggregate Root
 * 
 * The main entity representing a "Spike" (project proposal/initiative).
 * Aggregate Root owns and manages:
 * - SubSpikes (child aggregates for hierarchical organization)
 * - SpikeParts (value objects - stakeholders, resources)
 * - SpikeItems (child entities - line items)
 * - Tags (user-defined labels)
 * - Classifications (system-defined categorization)
 * 
 * References (by ID):
 * - SpikeCategory
 * - SpikeStatus
 */

import { SpikePartDto, SpikePartViewModel } from '../value-objects/spike-part.model';
import { SpikeItemDto, SpikeItemViewModel } from '../entities/spike-item.model';
import { SubSpikeDto, SubSpikeViewModel } from '../entities/sub-spike.model';

export interface SpikeDto {
  /** Unique identifier */
  id: string;
  /** Title */
  title: string;
  /** Description */
  description?: string;
  /** Category (FK to SpikeCategory) */
  categoryId: string;
  /** Status (FK to SpikeStatus) */
  statusId: string;
  /** Due date */
  dueDate?: string;
  /** Estimated effort (hours) */
  estimatedEffort?: number;
  /** Priority (1-5) */
  priority?: number;
  /** Classification IDs (system tags) */
  classificationIds: string[];
  /** Tag IDs (user-defined tags) */
  tagIds?: string[];
  /** Parts (value objects - stakeholders, resources) */
  parts: SpikePartDto[];
  /** Items (child entities - line items) */
  items: SpikeItemDto[];
  /** SubSpikes (child aggregates for hierarchical breakdown) */
  subSpikes?: SubSpikeDto[];
  /** Parent Spike ID (if this is a sub-spike itself) */
  parentId?: string;
  /** Created timestamp */
  createdUtc: string;
  /** Modified timestamp */
  modifiedUtc: string;
  /** Created by user ID */
  createdBy?: string;
  /** Modified by user ID */
  modifiedBy?: string;
}

export interface SpikeViewModel {
  // Identity
  id: string;
  
  // Core fields
  title: string;
  description: string;
  
  // References (resolved)
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  
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
  priority: number;
  priorityLabel: string;
  
  // Classifications (system tags)
  classificationIds: string[];
  
  // Tags (user-defined)
  tagIds: string[];
  tags: Array<{ id: string; name: string; color: string }>;

  // Nested
  parts: SpikePartViewModel[];
  items: SpikeItemViewModel[];
  subSpikes: SubSpikeViewModel[];
  
  // Hierarchy
  parentId: string | null;
  hasSubSpikes: boolean;
  
  // Computed
  itemCount: number;
  subSpikeCount: number;
  totalValue: number | null;
  completionPercentage: number;
  
  // Audit
  createdAt: Date;
  modifiedAt: Date;
  createdBy: string;
  modifiedBy: string;
  
  // Display
  displayLabel: string;
}

/**
 * Priority labels
 */
export const PRIORITY_LABELS: Record<number, string> = {
  1: 'Lowest',
  2: 'Low',
  3: 'Medium',
  4: 'High',
  5: 'Highest'
};

/**
 * Map Spike DTO to ViewModel
 * Requires resolved reference data for full mapping
 */
export function mapSpikeDtoToViewModel(
  dto: SpikeDto,
  options: {
    categoryName?: string;
    categoryIcon?: string;
    categoryColor?: string;
    statusName?: string;
    statusIcon?: string;
    statusColor?: string;
    tags?: Array<{ id: string; name: string; color: string }>;
    mapPart?: (part: SpikePartDto) => SpikePartViewModel;
    mapItem?: (item: SpikeItemDto) => SpikeItemViewModel;
    mapSubSpike?: (subSpike: SubSpikeDto) => SubSpikeViewModel;
  } = {}
): SpikeViewModel {
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

  const subSpikes = options.mapSubSpike && dto.subSpikes
    ? dto.subSpikes.map(options.mapSubSpike)
    : (dto.subSpikes || []).map(s => ({
        id: s.id,
        parentSpikeId: s.parentSpikeId,
        title: s.title,
        description: s.description || '',
        sequence: s.sequence,
        statusId: s.statusId,
        statusName: 'Unknown',
        statusIcon: 'bx-circle',
        statusColor: '#6c757d',
        dueDate: s.dueDate ? new Date(s.dueDate) : null,
        dueDateFormatted: s.dueDate ? new Date(s.dueDate).toLocaleDateString() : '',
        isOverdue: false,
        estimatedEffort: s.estimatedEffort ?? null,
        assignedTo: s.assignedTo || '',
        assignedToName: '',
        parts: [],
        items: [],
        itemCount: s.items?.length || 0,
        completionPercentage: 0,
        createdAt: new Date(s.createdUtc),
        modifiedAt: new Date(s.modifiedUtc),
        displayLabel: s.title
      }));

  const totalValue = items.reduce((sum, item) => {
    return item.lineTotal !== null ? sum + item.lineTotal : sum;
  }, 0) || null;

  // Calculate completion percentage based on completed sub-spikes
  const completedSubSpikes = subSpikes.filter(s => s.statusId === '4').length; // Assuming 4 = Completed
  const completionPercentage = subSpikes.length > 0 
    ? Math.round((completedSubSpikes / subSpikes.length) * 100) 
    : 0;

  return {
    id: dto.id,
    title: dto.title,
    description: dto.description || '',
    
    categoryId: dto.categoryId,
    categoryName: options.categoryName || 'Unknown',
    categoryIcon: options.categoryIcon || 'bx-category',
    categoryColor: options.categoryColor || '#6c757d',
    
    statusId: dto.statusId,
    statusName: options.statusName || 'Unknown',
    statusIcon: options.statusIcon || 'bx-circle',
    statusColor: options.statusColor || '#6c757d',
    
    dueDate,
    dueDateFormatted: dueDate ? dueDate.toLocaleDateString() : '',
    isOverdue,
    
    estimatedEffort: dto.estimatedEffort ?? null,
    priority: dto.priority ?? 3,
    priorityLabel: PRIORITY_LABELS[dto.priority ?? 3] || 'Medium',
    
    classificationIds: dto.classificationIds || [],
    
    tagIds: dto.tagIds || [],
    tags: options.tags || [],
    
    parts,
    items,
    subSpikes,
    
    parentId: dto.parentId || null,
    hasSubSpikes: subSpikes.length > 0,
    
    itemCount: items.length,
    subSpikeCount: subSpikes.length,
    totalValue,
    completionPercentage,
    
    createdAt: new Date(dto.createdUtc),
    modifiedAt: new Date(dto.modifiedUtc),
    createdBy: dto.createdBy || '',
    modifiedBy: dto.modifiedBy || '',
    
    displayLabel: dto.title
  };
}

/**
 * Map Spike ViewModel back to DTO (for save)
 */
export function mapSpikeViewModelToDto(vm: SpikeViewModel): SpikeDto {
  return {
    id: vm.id,
    title: vm.title,
    description: vm.description || undefined,
    categoryId: vm.categoryId,
    statusId: vm.statusId,
    dueDate: vm.dueDate?.toISOString() || undefined,
    estimatedEffort: vm.estimatedEffort ?? undefined,
    priority: vm.priority,
    classificationIds: vm.classificationIds,
    tagIds: vm.tagIds,
    parts: vm.parts.map(p => ({
      typeId: p.typeId,
      name: p.name,
      value: p.value,
      secondaryValue: p.secondaryValue || undefined,
      notes: p.notes || undefined
    })),
    items: vm.items.map(i => ({
      id: i.id,
      spikeId: i.spikeId,
      typeId: i.typeId,
      description: i.description,
      quantity: i.quantity ?? undefined,
      unit: i.unit || undefined,
      unitPrice: i.unitPrice ?? undefined,
      sequence: i.sequence,
      notes: i.notes || undefined,
      createdUtc: i.createdAt.toISOString(),
      modifiedUtc: i.modifiedAt.toISOString()
    })),
    subSpikes: vm.subSpikes.map(s => ({
      id: s.id,
      parentSpikeId: s.parentSpikeId,
      title: s.title,
      description: s.description || undefined,
      statusId: s.statusId,
      sequence: s.sequence,
      dueDate: s.dueDate?.toISOString() || undefined,
      estimatedEffort: s.estimatedEffort ?? undefined,
      assignedTo: s.assignedTo || undefined,
      parts: [],
      items: [],
      createdUtc: s.createdAt.toISOString(),
      modifiedUtc: s.modifiedAt.toISOString()
    })),
    parentId: vm.parentId || undefined,
    createdUtc: vm.createdAt.toISOString(),
    modifiedUtc: vm.modifiedAt.toISOString(),
    createdBy: vm.createdBy || undefined,
    modifiedBy: vm.modifiedBy || undefined
  };
}

/**
 * Create empty Spike
 */
export function createEmptySpike(): SpikeDto {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: '',
    description: undefined,
    categoryId: '',
    statusId: '1', // Draft
    dueDate: undefined,
    estimatedEffort: undefined,
    priority: 3,
    classificationIds: [],
    tagIds: [],
    parts: [],
    items: [],
    subSpikes: [],
    parentId: undefined,
    createdUtc: now,
    modifiedUtc: now,
    createdBy: undefined,
    modifiedBy: undefined
  };
}
