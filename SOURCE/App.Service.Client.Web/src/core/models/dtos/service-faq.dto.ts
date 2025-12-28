/**
 * ServiceFaq DTO (Data Transfer Object)
 * 
 * Represents FAQ data as received from the API.
 * This is the raw data structure before any transformation for UI needs.
 * 
 * Pattern: DTO → Mapper → ViewModel → Service → Component
 */
export interface ServiceFaqDto {
  /** Unique identifier */
  id: string;
  
  /** Whether this FAQ is enabled/visible */
  enabled: boolean;
  
  /** Question text */
  title: string;
  
  /** Answer text */
  description: string;
  
  /** Category identifier for grouping FAQs */
  categoryId: string;
}
