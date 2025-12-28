/**
 * Architecture Principle View Model
 */
export interface ArchitecturePrincipleViewModel {
  readonly id: string;
  readonly typeId: string;
  readonly title: string;
  readonly description?: string;
  readonly displayLabel: string;
}
