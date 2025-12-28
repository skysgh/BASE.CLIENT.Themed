/**
 * Job ViewModel
 * 
 * UI-optimized representation of a job posting.
 * Used by components for display and interaction.
 */
export interface JobViewModel {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  skills: string[];
  imageUrl: string;
  isEnabled: boolean;
  isBookmarked: boolean;
}
