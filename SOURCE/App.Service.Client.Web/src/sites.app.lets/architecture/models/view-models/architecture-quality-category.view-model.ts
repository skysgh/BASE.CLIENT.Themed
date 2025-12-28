/**
 * Architecture Quality Category View Model
 */
export interface ArchitectureQualityCategoryViewModel {
  readonly id: string;
  readonly typeId: string;
  readonly title: string;
  readonly description?: string;
  readonly displayLabel: string;
}
