/**
 * Language DTO
 * 
 * Data transfer object for available languages from API.
 */
export interface LanguageDto {
  id: string;
  serviceId?: string;
  enabled: boolean;
  title: string;
  description: string;
  languageCode: string;
  flagImageId: string;
}

/** Create/Update language request */
export interface UpdateLanguageDto {
  enabled?: boolean;
  title?: string;
  description?: string;
}
