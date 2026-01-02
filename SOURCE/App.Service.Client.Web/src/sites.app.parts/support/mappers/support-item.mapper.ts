/**
 * Support Item Mapper
 * 
 * Maps DTOs to ViewModels.
 */
import { SupportItemDto, SupportCommentDto } from '../models/support-item.dto';
import { SupportItemViewModel, SupportCommentViewModel } from '../models/support-item.view-model';
import { 
  getStatusConfig, 
  getTypeConfig, 
  getPriorityConfig, 
  getStatusProgress 
} from '../constants';

/**
 * Calculate relative time label
 */
function getAgeLabel(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

/**
 * Map DTO to ViewModel
 */
export function mapSupportItemDtoToViewModel(dto: SupportItemDto): SupportItemViewModel {
  const typeConfig = getTypeConfig(dto.type);
  const statusConfig = getStatusConfig(dto.status);
  const priorityConfig = getPriorityConfig(dto.priority);
  const createdAt = new Date(dto.createdUtc);
  const updatedAt = new Date(dto.updatedUtc);
  
  return {
    id: dto.id,
    
    // Type
    type: dto.type,
    typeName: typeConfig?.name || dto.type,
    typeIcon: typeConfig?.icon || 'bx-file',
    typeColor: typeConfig?.color || '#6c757d',
    
    // Content
    title: dto.title,
    description: dto.description,
    
    // Status
    status: dto.status,
    statusName: statusConfig?.name || dto.status,
    statusIcon: statusConfig?.icon || 'bx-circle',
    statusColor: statusConfig?.color || '#6c757d',
    progressPercent: getStatusProgress(dto.status),
    
    // Priority
    priority: dto.priority,
    priorityName: priorityConfig?.name || dto.priority,
    priorityIcon: priorityConfig?.icon || 'bx-minus',
    priorityColor: priorityConfig?.color || '#6c757d',
    
    // People
    submittedBy: dto.submittedBy,
    submittedByName: dto.submittedByName || 'Unknown',
    assignedTo: dto.assignedTo,
    assignedToName: dto.assignedToName,
    
    // Metadata
    category: dto.category,
    externalId: dto.externalId,
    externalUrl: dto.externalUrl,
    
    // Dates
    createdAt,
    updatedAt,
    resolvedAt: dto.resolvedUtc ? new Date(dto.resolvedUtc) : undefined,
    
    // Computed
    displayLabel: `[${typeConfig?.name || dto.type}] ${dto.title}`,
    isOpen: dto.status !== 'closed',
    ageLabel: getAgeLabel(createdAt),
  };
}

/**
 * Map array of DTOs to ViewModels
 */
export function mapSupportItemDtosToViewModels(dtos: SupportItemDto[]): SupportItemViewModel[] {
  return dtos.map(mapSupportItemDtoToViewModel);
}

/**
 * Map Comment DTO to ViewModel
 */
export function mapSupportCommentDtoToViewModel(dto: SupportCommentDto): SupportCommentViewModel {
  const createdAt = new Date(dto.createdUtc);
  
  return {
    id: dto.id,
    itemId: dto.itemId,
    authorId: dto.authorId,
    authorName: dto.authorName || 'Unknown',
    content: dto.content,
    internal: dto.internal,
    createdAt,
    ageLabel: getAgeLabel(createdAt),
  };
}
