/**
 * Job DTO (Data Transfer Object)
 * 
 * Server contract for job posting data.
 * Maps directly to API response structure.
 */
export interface JobDto {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  company: string;
  imageName?: string;
  locationFK?: string;
  typeFK?: string;
  salaryRangeLower?: number;
  salaryRangeUpper?: number;
  bookmark?: boolean;
  skill?: string[];
  tenantFK?: string;
  serviceFK?: string;
}
