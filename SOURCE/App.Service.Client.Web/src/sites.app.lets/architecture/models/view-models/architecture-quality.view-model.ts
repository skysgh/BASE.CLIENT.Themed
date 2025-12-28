/**
 * Architecture Quality View Model
 */
export interface ArchitectureQualityViewModel {
  readonly id: string;
  readonly categoryId: string;
  readonly title: string;
  readonly description?: string;
  readonly displayLabel: string;
}
