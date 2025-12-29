/**
 * SpikePart - Value Object
 * 
 * A part of a Spike (like Address is to Invoice).
 * Value Objects have no identity - they are defined by their attributes.
 * 
 * Examples:
 * - Owner: "John Smith", "john@example.com"
 * - Reviewer: "Jane Doe", "jane@example.com"
 * - Stakeholder: "Product Team", "product@example.com"
 */

export interface SpikePartDto {
  /** Type of part (FK to SpikePartType) */
  typeId: string;
  /** Name/title of the part */
  name: string;
  /** Primary value (email, phone, etc.) */
  value: string;
  /** Secondary value */
  secondaryValue?: string;
  /** Additional notes */
  notes?: string;
}

export interface SpikePartViewModel {
  typeId: string;
  typeName: string;
  typeIcon: string;
  name: string;
  value: string;
  secondaryValue: string;
  notes: string;
  displayLabel: string;
}

export function mapSpikePartDtoToViewModel(
  dto: SpikePartDto, 
  typeName: string = 'Unknown',
  typeIcon: string = 'bx-user'
): SpikePartViewModel {
  return {
    typeId: dto.typeId,
    typeName,
    typeIcon,
    name: dto.name,
    value: dto.value,
    secondaryValue: dto.secondaryValue || '',
    notes: dto.notes || '',
    displayLabel: `${dto.name} (${typeName})`
  };
}

export function mapSpikePartViewModelToDto(vm: SpikePartViewModel): SpikePartDto {
  return {
    typeId: vm.typeId,
    name: vm.name,
    value: vm.value,
    secondaryValue: vm.secondaryValue || undefined,
    notes: vm.notes || undefined
  };
}

/**
 * Create empty SpikePart for a given type
 */
export function createEmptySpikePart(typeId: string): SpikePartDto {
  return {
    typeId,
    name: '',
    value: '',
    secondaryValue: undefined,
    notes: undefined
  };
}
