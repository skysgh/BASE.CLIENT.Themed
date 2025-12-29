/**
 * SpikeItem - Child Entity
 * 
 * A child entity of a Spike (like LineItem is to Invoice).
 * Entities have identity (id) and lifecycle.
 * 
 * Examples:
 * - Task: "Implement login", quantity: 8 (hours)
 * - Deliverable: "API Documentation", quantity: 1, unitPrice: 500
 * - Resource: "Cloud Server", quantity: 2, unitPrice: 100/month
 */

export interface SpikeItemDto {
  /** Unique identifier */
  id: string;
  /** Parent Spike ID */
  spikeId: string;
  /** Type of item (FK to SpikeItemType) */
  typeId: string;
  /** Item description */
  description: string;
  /** Quantity (optional based on type) */
  quantity?: number;
  /** Unit of measure */
  unit?: string;
  /** Unit price (optional based on type) */
  unitPrice?: number;
  /** Sequence/order in list */
  sequence: number;
  /** Notes */
  notes?: string;
  /** Created timestamp */
  createdUtc: string;
  /** Modified timestamp */
  modifiedUtc: string;
}

export interface SpikeItemViewModel {
  id: string;
  spikeId: string;
  typeId: string;
  typeName: string;
  typeIcon: string;
  description: string;
  quantity: number | null;
  unit: string;
  unitPrice: number | null;
  sequence: number;
  notes: string;
  createdAt: Date;
  modifiedAt: Date;
  /** Computed: quantity * unitPrice */
  lineTotal: number | null;
  displayLabel: string;
}

export function mapSpikeItemDtoToViewModel(
  dto: SpikeItemDto,
  typeName: string = 'Unknown',
  typeIcon: string = 'bx-list-ul'
): SpikeItemViewModel {
  const quantity = dto.quantity ?? null;
  const unitPrice = dto.unitPrice ?? null;
  const lineTotal = (quantity !== null && unitPrice !== null) ? quantity * unitPrice : null;

  return {
    id: dto.id,
    spikeId: dto.spikeId,
    typeId: dto.typeId,
    typeName,
    typeIcon,
    description: dto.description,
    quantity,
    unit: dto.unit || '',
    unitPrice,
    sequence: dto.sequence,
    notes: dto.notes || '',
    createdAt: new Date(dto.createdUtc),
    modifiedAt: new Date(dto.modifiedUtc),
    lineTotal,
    displayLabel: `${dto.description} (${typeName})`
  };
}

export function mapSpikeItemViewModelToDto(vm: SpikeItemViewModel): SpikeItemDto {
  return {
    id: vm.id,
    spikeId: vm.spikeId,
    typeId: vm.typeId,
    description: vm.description,
    quantity: vm.quantity ?? undefined,
    unit: vm.unit || undefined,
    unitPrice: vm.unitPrice ?? undefined,
    sequence: vm.sequence,
    notes: vm.notes || undefined,
    createdUtc: vm.createdAt.toISOString(),
    modifiedUtc: vm.modifiedAt.toISOString()
  };
}

/**
 * Create empty SpikeItem for a given spike
 */
export function createEmptySpikeItem(spikeId: string, typeId: string, sequence: number): SpikeItemDto {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    spikeId,
    typeId,
    description: '',
    quantity: undefined,
    unit: undefined,
    unitPrice: undefined,
    sequence,
    notes: undefined,
    createdUtc: now,
    modifiedUtc: now
  };
}
