/**
 * System Embargo View Model
 */
export interface SystemEmbargoViewModel {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  displayLabel: string;
  year?: string;
  reference?: string;
}
