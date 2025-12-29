export interface JobViewModel {
  id: string;
  enabled: boolean;
  title: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
  logoUrl: string;
  isBookmarked: boolean;
  displayLabel: string;
}
