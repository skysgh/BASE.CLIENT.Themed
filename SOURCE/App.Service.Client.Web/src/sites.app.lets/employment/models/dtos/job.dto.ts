export interface JobDto {
  id: string;
  enabled?: boolean;
  title: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
  logo?: string;
  bookmark?: boolean;
}
