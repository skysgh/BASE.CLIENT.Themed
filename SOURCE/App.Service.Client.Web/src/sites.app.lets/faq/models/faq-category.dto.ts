/**
 * FAQ Category DTO
 * 
 * Data Transfer Object for FAQ categories.
 * Matches the shape of data from API/JSON.
 */
export interface FaqCategoryDto {
  /** Unique identifier */
  id: string;
  
  /** Title - can be i18n key or plain text */
  title: string;
  
  /** Description of what this category covers */
  description?: string;
  
  /** Icon identifier (from FAQ_CATEGORY_ICONS) */
  icon: string;
  
  /** Display order (lower = first) */
  order: number;
  
  /** Is this category enabled/visible? */
  enabled: boolean;
  
  /** Culture code (e.g., 'en', 'fr') */
  cultureCode: string;
  
  /** Created timestamp */
  createdUtc: string;
  
  /** Last updated timestamp */
  updatedUtc: string;
}
