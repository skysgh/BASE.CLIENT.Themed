/**
 * FAQ Item DTO
 * 
 * Data Transfer Object for individual FAQ items (questions & answers).
 */
export interface FaqItemDto {
  /** Unique identifier */
  id: string;
  
  /** Parent category ID (FK) */
  categoryId: string;
  
  /** The question */
  question: string;
  
  /** The answer (can contain markdown) */
  answer: string;
  
  /** Display order within category (lower = first) */
  order: number;
  
  /** Is this item enabled/visible? */
  enabled: boolean;
  
  /** Culture code (e.g., 'en', 'fr') */
  cultureCode: string;
  
  /** Tags for search/filtering */
  tags?: string[];
  
  /** Created timestamp */
  createdUtc: string;
  
  /** Last updated timestamp */
  updatedUtc: string;
}
