/**
 * Embargo Mapper
 * 
 * Converts between DTO and ViewModel representations.
 */
import { EmbargoDto } from '../models/embargo.dto';
import { EmbargoViewModel, EmbargoStatus, EmbargoStats } from '../models/embargo.view-model';

/**
 * Map single DTO to ViewModel
 */
export function mapEmbargoToViewModel(dto: EmbargoDto): EmbargoViewModel {
  const effectiveFrom = new Date(dto.effectiveFrom);
  const effectiveTo = dto.effectiveTo ? new Date(dto.effectiveTo) : null;
  const now = new Date();
  
  // Determine status
  const status = determineStatus(dto.enabled, effectiveFrom, effectiveTo, now);
  
  // Determine if currently active
  const isCurrentlyActive = dto.enabled && 
    effectiveFrom <= now && 
    (effectiveTo === null || effectiveTo >= now);
  
  return {
    id: dto.id,
    countryCode: dto.countryCode,
    countryName: dto.countryName,
    reason: dto.reason,
    legalReference: dto.legalReference,
    effectiveFrom,
    effectiveTo,
    enabled: dto.enabled,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    
    // Computed
    displayName: `${dto.countryName} (${dto.countryCode})`,
    status,
    statusColor: getStatusColor(status),
    flagEmoji: countryCodeToFlag(dto.countryCode),
    durationDisplay: formatDuration(effectiveFrom, effectiveTo),
    isCurrentlyActive
  };
}

/**
 * Map array of DTOs to ViewModels
 */
export function mapEmbargosToViewModels(dtos: EmbargoDto[]): EmbargoViewModel[] {
  return dtos.map(mapEmbargoToViewModel);
}

/**
 * Calculate embargo statistics
 */
export function calculateEmbargoStats(viewModels: EmbargoViewModel[]): EmbargoStats {
  const total = viewModels.length;
  const active = viewModels.filter(vm => vm.status === 'active').length;
  const inactive = viewModels.filter(vm => vm.status === 'inactive').length;
  const scheduled = viewModels.filter(vm => vm.status === 'scheduled').length;
  
  // UN recognized sovereign states
  const totalCountries = 193;
  const availableCountries = totalCountries - active;
  const coveragePercent = Math.round((availableCountries / totalCountries) * 100);
  
  return {
    total,
    active,
    inactive,
    scheduled,
    totalCountries,
    availableCountries,
    coveragePercent
  };
}

// === Helper Functions ===

function determineStatus(
  enabled: boolean, 
  from: Date, 
  to: Date | null, 
  now: Date
): EmbargoStatus {
  if (!enabled) return 'inactive';
  if (from > now) return 'scheduled';
  if (to && to < now) return 'expired';
  return 'active';
}

function getStatusColor(status: EmbargoStatus): 'success' | 'warning' | 'danger' | 'secondary' {
  switch (status) {
    case 'active': return 'danger';      // Red - blocked
    case 'inactive': return 'secondary'; // Gray - disabled
    case 'scheduled': return 'warning';  // Yellow - pending
    case 'expired': return 'success';    // Green - lifted
  }
}

function countryCodeToFlag(code: string): string {
  // Convert country code to flag emoji using regional indicator symbols
  const codePoints = [...code.toUpperCase()]
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function formatDuration(from: Date, to: Date | null): string {
  if (!to) return 'Indefinite';
  
  const now = new Date();
  if (to < now) return `Expired ${to.toLocaleDateString()}`;
  
  const diff = to.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 30) return `${days} days remaining`;
  if (days < 365) return `${Math.round(days / 30)} months remaining`;
  return `Until ${to.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
}
